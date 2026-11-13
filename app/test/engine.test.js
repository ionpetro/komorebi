const test=require('node:test'),assert=require('node:assert/strict'),{Engine:E}=require('../src/engine.js');
const {loadUnits}=require('../src/course.js');
global.Engine=E;
const {Kana}=require('../src/kana.js');
const ix=E.indexCourse(loadUnits());
test('calendar math and streak count work across DST and repeated same-day practice',()=>{
  assert.equal(E.daysBetween('2026-03-07','2026-03-09'),2);
  const s=E.freshState(); E.touchStreak(s,'2026-11-02');E.touchStreak(s,'2026-11-02');assert.equal(s.streak,1);E.touchStreak(s,'2026-11-03');assert.equal(s.streak,2);
});
test('weekends are free, one freeze protects a missed weekday, exhaustion resets',()=>{
  const s=E.freshState();for(const d of ['2026-11-06','2026-11-09','2026-11-11'])E.touchStreak(s,d);assert.equal(s.streak,3);assert.equal(s.freezes,0);E.touchStreak(s,'2026-11-13');assert.equal(s.streak,1);
});
test('Monday streak preview accounts for the same freeze refill as a learning event',()=>{
  const s=E.freshState();E.touchStreak(s,'2026-11-05');s.freezes=0;const before=E.liveStreak(s,'2026-11-09');assert.equal(before,1);E.touchStreak(s,'2026-11-09');assert.equal(s.streak,before+1);
});
test('spaced review promotes only due cards, preserves early dates, and resets misses',()=>{
  const s=E.freshState();E.learn(s,'word','2026-11-01');assert.equal(s.items.word.due,'2026-11-02');E.grade(s,'word',true,'2026-11-02');assert.deepEqual([s.items.word.box,s.items.word.due],[2,'2026-11-05']);E.grade(s,'word',true,'2026-11-03');assert.deepEqual([s.items.word.box,s.items.word.due],[2,'2026-11-05']);E.grade(s,'word',false,'2026-11-03');assert.deepEqual([s.items.word.box,s.items.word.due],[1,'2026-11-04']);
});
test('valid reading variants preserve vowel length',()=>{
  for(const [a,b] of [['arigatō','arigatou'],['kūkō','kuukou'],['Ohayō gozaimasu.','ohayou gozaimasu']])assert.ok(E.acceptsRomaji(a,b));
  assert.equal(E.acceptsRomaji('obāsan','obasan'),false);assert.equal(E.acceptsRomaji('kitte','kite'),false);assert.equal(E.acceptsRomaji('kōhī','kohi'),false);
});
test('invalid imports are repaired without mutating the input',()=>{
  const raw={xp:-2,goal:900,theme:'fake',items:{bad:{box:99,due:'not a date'},good:{box:1,due:'2026-11-03'}}};const s=E.repairState(raw);assert.equal(s.xp,0);assert.equal(s.goal,10);assert.equal(s.theme,'auto');assert.equal(s.items.bad,undefined);assert.ok(raw.items.bad);assert.equal(s.app,'komorebi');
});
test('partial assessment exposure survives export and import',()=>{
  const s=E.freshState();s.assessmentSeen.u1='2026-11-13';s.assessmentSeen.u100='2026-11-13';s.assessmentSeen.u2='not a date';const restored=E.repairState(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored.assessmentSeen,{u1:'2026-11-13'});
});
test('repeated sentence chunks keep independent selectable keys',()=>{
  const q=E.question({id:'test',kind:'sentence',ja:'はい、はい。',romaji:'hai, hai.',meaning:'Yes, yes.',tiles:[{ja:'はい',romaji:'hai'},{ja:'はい',romaji:'hai'}],distractors:[{ja:'いいえ',romaji:'iie'}]},E.rng(1));assert.deepEqual(q.answer,['はい','はい']);assert.equal(new Set(q.tiles.map(t=>t.key)).size,3);
});
test('scenario shuffling always preserves the correct explanation',()=>{
  const item=[...ix.assessmentItems.values()][0];assert.ok(item);
  for(let seed=1;seed<30;seed++){const q=E.question(item,E.rng(seed));assert.equal(q.options[q.answer].text,item.options[item.answer].text);assert.equal(q.options[q.answer].why,item.options[item.answer].why);}
});
test('review badge requires completed review rather than in-lesson retrieval',()=>{
  const s=E.freshState();E.learn(s,'x','2026-11-01');E.grade(s,'x',true,'2026-11-02');assert.ok(!E.awardBadges(ix,s,'2026-11-02').some(b=>b.id==='first_review'));s.reviewSessions=1;assert.ok(E.awardBadges(ix,s,'2026-11-02').some(b=>b.id==='first_review'));
});
test('matching excludes duplicate writing and duplicate meanings',()=>{
  const s=E.freshState();for(const [id]of ix.items)E.learn(s,id,'2026-11-01');
  for(let seed=1;seed<20;seed++){const q=E.buildMatch(ix,s,'2026-11-02',seed);assert.ok(q);assert.equal(new Set(q.pairs.map(p=>E.norm(p.ja))).size,q.pairs.length);assert.equal(new Set(q.pairs.map(p=>E.norm(p.meaning))).size,q.pairs.length);}
});
test('kana includes all 46 basics in both scripts and unique identities',()=>{
  assert.equal(Kana.cards.length,208);assert.equal(Kana.select('hiragana','basic').length,46);assert.equal(Kana.select('katakana','basic').length,46);assert.equal(new Set(Kana.cards.map(c=>c.id)).size,208);assert.ok(Kana.cards.some(c=>c.ja==='きゃ'&&c.romaji==='kya'));assert.ok(Kana.cards.some(c=>c.ja==='キャ'&&c.romaji==='kya'));
});
test('kana introduces unknown symbols and reviews known symbols with distinct choices',()=>{
  const s=E.freshState(),steps=Kana.build(s,'hiragana','vowels','2026-11-13',1);assert.equal(steps.length,10);
  for(const q of steps.filter(q=>q.type==='kana-choice')){assert.equal(new Set(q.options).size,4);assert.ok(q.options.includes(q.answer));Kana.grade(s,q.itemId,true,'2026-11-13');}
  assert.equal(Kana.build(s,'hiragana','vowels','2026-11-13',1).length,5);assert.equal(Object.keys(s.items).length,0);
});
test('kana early practice cannot postpone a due date',()=>{
  const s=E.freshState();Kana.grade(s,'kana-hiragana-vowels-0',true,'2026-11-01');Kana.grade(s,'kana-hiragana-vowels-0',true,'2026-11-02');const due=s.kanaProgress['kana-hiragana-vowels-0'].due;Kana.grade(s,'kana-hiragana-vowels-0',true,'2026-11-03');assert.equal(s.kanaProgress['kana-hiragana-vowels-0'].due,due);
});
