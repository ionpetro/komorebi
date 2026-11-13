const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {Engine:E}=require('../src/engine.js');
const {loadUnits}=require('../src/course.js');

test('progress import discards malformed assessments and normalizes numeric statistics',()=>{
  const original={app:'komorebi',assessments:[null,'wrong',{unitId:'u1',at:'2026-02-30',score:2,total:2},{unitId:'u7',at:'2026-11-13',score:9,total:2}],answered:'12',correct:'20',speedBest:Infinity,streak:Infinity,bestStreak:'4',reviewSessions:'2',days:{'2026-11-13':'5'},items:{bad:{box:1,due:'2026-99-99'},good:{box:2,due:'2026-11-14',right:'3',wrong:Infinity}},kanaProgress:{a:{box:1,due:'2026-11-14',right:Infinity,wrong:'2'}}};
  const s=E.repairState(original);
  assert.equal(s.answered,12);assert.equal(s.correct,12);assert.equal(s.speedBest,0);assert.equal(s.streak,0);assert.equal(s.bestStreak,4);assert.equal(s.reviewSessions,2);assert.equal(s.days['2026-11-13'],5);
  assert.deepEqual(s.assessments,[{unitId:'u7',at:'2026-11-13',score:2,total:2}]);
  assert.doesNotThrow(()=>s.assessments.some(a=>a.unitId==='u7'));
  assert.equal(s.items.bad,undefined);assert.deepEqual(s.items.good,{box:2,due:'2026-11-14',right:3,wrong:0});
  assert.deepEqual(s.kanaProgress.a,{box:1,due:'2026-11-14',right:0,wrong:2});
  assert.equal(original.assessments[3].score,9);assert.equal(original.items.good.right,'3');
});

test('import retains valid completions and avoids prototype-key records',()=>{
  const raw=JSON.parse('{"done":{"u5l1":{"at":"2026-11-13","perfect":true},"u5l2":null,"__proto__":{"at":"2026-11-13"}},"mistakes":{"u5-1-1":"2","u5-1-2":-3},"daily":{"2026-11-13":{"score":8,"total":5}},"badges":{"first_step":"2026-11-13","bad":"2026-13-32"}}');
  const s=E.repairState(raw);
  assert.deepEqual(s.done,{u5l1:{at:'2026-11-13',perfect:true}});assert.equal(Object.getPrototypeOf(s.done),Object.prototype);
  assert.deepEqual(s.mistakes,{'u5-1-1':2});assert.deepEqual(s.daily['2026-11-13'],{score:5,total:5});assert.deepEqual(s.badges,{first_step:'2026-11-13'});
});

function appHarness(initialState=E.freshState()){
  const units=loadUnits(),state=initialState;state.onboarded=true;
  const listeners={},inputs={},root={innerHTML:'',addEventListener:(name,fn)=>listeners[name]=fn};
  const document={getElementById:id=>id==='app'?root:inputs[id]||null,documentElement:{dataset:{}},body:{classList:{toggle(){}}},addEventListener(){}};
  let saved=JSON.stringify(state);
  const context={Engine:E,KOMOREBI_UNITS:units,document,window:{scrollTo(){}},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},setTimeout(){},clearInterval(){},setInterval(){},console,Date};
  vm.runInNewContext(fs.readFileSync(require.resolve('../src/app.js'),'utf8'),context);
  const clickData=(act,data={})=>listeners.click({target:{closest:()=>({disabled:false,dataset:{act,...data}})}});
  const click=(act,key)=>clickData(act,key===undefined?{}:{key:String(key)});
  const submitRomaji=value=>{inputs['romaji-answer']={value};listeners.submit({target:{id:'romaji-form'},preventDefault(){}});};
  return{root,click,clickData,submitRomaji,state:()=>JSON.parse(saved)};
}
function matchingHarness(){
  const units=loadUnits(),ix=E.indexCourse(units),state=E.freshState();
  for(const w of [...ix.items.values()].filter(i=>i.kind==='word').slice(0,12))E.learn(state,w.id,'2026-11-12');
  const h=appHarness(state);h.click('start-match');
  h.keys=[...h.root.innerHTML.matchAll(/data-act="match-left" data-key="(\d+)"/g)].map(m=>Number(m[1]));
  return h;
}

test('matching reports a mismatched pair and does not claim first-try success after correction',()=>{
  const h=matchingHarness();assert.ok(h.keys.length>=3);
  h.click('match-left',h.keys[0]);h.click('match-right',h.keys[1]);
  assert.match(h.root.innerHTML,/That pair did not match/);
  for(const k of h.keys){h.click('match-left',k);h.click('match-right',k);}
  assert.match(h.root.innerHTML,/Keep going\./);
  h.click('next'); // One bounded, unscored retry of the matching set.
  for(const k of h.keys){h.click('match-left',k);h.click('match-right',k);}
  h.click('next');
  assert.match(h.root.innerHTML,/Sitting complete/);
  assert.match(h.root.innerHTML,/0 of 1 questions answered on the first try/);
});

test('a clean matching round earns one first-try result and no retry',()=>{
  const h=matchingHarness();for(const k of h.keys){h.click('match-left',k);h.click('match-right',k);}h.click('next');
  assert.match(h.root.innerHTML,/Sitting complete/);assert.match(h.root.innerHTML,/1 of 1 questions answered on the first try/);
});


test('listening without a Japanese voice reveals meanings without grading or changing review cards',()=>{
  const state=E.freshState(),units=loadUnits(),ix=E.indexCourse(units);
  const words=[...ix.items.values()].filter(i=>i.kind==='word').slice(0,10);
  for(const w of words)E.learn(state,w.id,'2026-11-12');
  state.answered=11;state.correct=7;
  const before=JSON.parse(JSON.stringify({answered:state.answered,correct:state.correct,items:state.items}));
  const h=appHarness(state);h.click('start-listening');
  let revealed=0;
  while(!h.root.innerHTML.includes('Sitting complete')){
    assert.ok(revealed<8,'listening run should finish within its eight learned words');
    assert.match(h.root.innerHTML,/No Japanese voice is available/);
    assert.match(h.root.innerHTML,/Read and say it aloud/);
    assert.doesNotMatch(h.root.innerHTML,/data-act="answer"/);
    h.click('listen-reveal');assert.match(h.root.innerHTML,/Meaning revealed/);
    h.click('next');revealed++;
  }
  assert.equal(revealed,8);assert.match(h.root.innerHTML,/No listening score/);
  const after=h.state();assert.deepEqual({answered:after.answered,correct:after.correct,items:after.items},before);
});

// Complete the visible UI, deliberately allowing mistakes. This exercises the
// real retry route rather than setting lesson completion directly in storage.
function completeVisibleSitting(h){
  for(let n=0;n<100;n++){
    const html=h.root.innerHTML;
    if(html.includes('Sitting complete'))return;
    if(html.includes('data-act="lesson-begin"')){h.click('lesson-begin');continue;}
    if(html.includes('data-act="next"')){h.click('next');continue;}
    if(html.includes('id="romaji-form"')){h.submitRomaji('nanji');continue;}
    const choice=/data-act="answer" data-value="([^"]*)"/.exec(html);
    if(choice){h.clickData('answer',{value:choice[1].replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"')});continue;}
    const tile=/data-act="add-tile" data-key="(\d+)"/.exec(html);
    if(tile){h.click('add-tile',Number(tile[1]));h.click('check-tiles');continue;}
    assert.fail('Unrecognized practice screen while completing the sitting');
  }
  assert.fail('The sitting did not finish after bounded answers and retries');
}

test('lesson continuation advances to the second sitting and reveals the dialogue only after completion',()=>{
  const h=appHarness();h.clickData('start-lesson',{id:'u5l1'});
  completeVisibleSitting(h);
  assert.equal(h.state().sittings.u5l1,1);assert.equal(h.state().done.u5l1,undefined);
  assert.match(h.root.innerHTML,/data-act="continue-lesson"/);
  assert.match(h.root.innerHTML,/data-act="finish-session"/);
  assert.doesNotMatch(h.root.innerHTML,/Now make it a conversation/);
  assert.doesNotMatch(h.root.innerHTML,/What time do you get up\?/);
  h.click('continue-lesson');assert.match(h.root.innerHTML,/data-act="lesson-begin"/);
  h.click('lesson-begin');
  assert.match(h.root.innerHTML,/Build the sentence/);
  assert.match(h.root.innerHTML,/七時半/);
  completeVisibleSitting(h);
  assert.equal(h.state().sittings.u5l1,2);assert.ok(h.state().done.u5l1);
  assert.match(h.root.innerHTML,/Now make it a conversation/);
  assert.match(h.root.innerHTML,/What time do you get up\?/);
  assert.doesNotMatch(h.root.innerHTML,/data-act="continue-lesson"/);
});
