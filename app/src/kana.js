// Basic kana plus voiced and contracted sounds. Original practice, no stroke-order claim.
const Kana=(()=>{
  const rows=[
    ['vowels','Vowels','あいうえお','a i u e o'],['k','K row','かきくけこ','ka ki ku ke ko'],
    ['s','S row','さしすせそ','sa shi su se so'],['t','T row','たちつてと','ta chi tsu te to'],
    ['n','N row','なにぬねの','na ni nu ne no'],['h','H row','はひふへほ','ha hi fu he ho'],
    ['m','M row','まみむめも','ma mi mu me mo'],['y','Y row','やゆよ','ya yu yo'],
    ['r','R row','らりるれろ','ra ri ru re ro'],['w','W + N','わをん','wa o n'],
    ['g','G row','がぎぐげご','ga gi gu ge go'],['z','Z row','ざじずぜぞ','za ji zu ze zo'],
    ['d','D row','だぢづでど','da ji zu de do'],['b','B row','ばびぶべぼ','ba bi bu be bo'],
    ['p','P row','ぱぴぷぺぽ','pa pi pu pe po'],
    ['contracted','Small ゃ ゅ ょ','きゃ きゅ きょ しゃ しゅ しょ ちゃ ちゅ ちょ にゃ にゅ にょ ひゃ ひゅ ひょ みゃ みゅ みょ りゃ りゅ りょ ぎゃ ぎゅ ぎょ じゃ じゅ じょ びゃ びゅ びょ ぴゃ ぴゅ ぴょ','kya kyu kyo sha shu sho cha chu cho nya nyu nyo hya hyu hyo mya myu myo rya ryu ryo gya gyu gyo ja ju jo bya byu byo pya pyu pyo']
  ];
  const katakana=s=>[...s].map(c=>String.fromCharCode(c.charCodeAt(0)+0x60)).join('');
  const cards=rows.flatMap(([row,label,jp,readings],ri)=>{
    const symbols=jp.includes(' ')?jp.split(' '):[...jp];
    return symbols.flatMap((h,i)=>['hiragana','katakana'].map(script=>({id:`kana-${script}-${row}-${i}`,row,script,ja:script==='hiragana'?h:katakana(h),romaji:readings.split(' ')[i],basic:ri<10})));
  });
  function select(script,row){return cards.filter(c=>c.script===script&&(row==='all'||row==='basic'&&c.basic||c.row===row));}
  function build(state,script,row,today,seed=1){
    const r=Engine.rng(seed), pool=select(script,row), shuffled=Engine.shuffle(pool,r);
    // Prioritize due/unknown symbols; limit a sitting to ten.
    shuffled.sort((a,b)=>Number(!!state.kanaProgress[a.id]&&state.kanaProgress[a.id].due>today)-Number(!!state.kanaProgress[b.id]&&state.kanaProgress[b.id].due>today));
    return shuffled.slice(0,10).flatMap(c=>{
      const nearby=Engine.shuffle([...new Set(pool.filter(x=>x.romaji!==c.romaji).map(x=>x.romaji))],r);
      const fallback=Engine.shuffle([...new Set(cards.filter(x=>x.basic&&x.romaji!==c.romaji&&!nearby.includes(x.romaji)).map(x=>x.romaji))],r);
      const options=Engine.shuffle([c.romaji,...[...nearby,...fallback].slice(0,3)],r);
      const q={type:'kana-choice',itemId:c.id,ja:c.ja,answer:c.romaji,options,label:'Read the kana',prompt:'Which reading matches?',explain:`${c.ja} is read ${c.romaji}.`,say:`${c.ja} → ${c.romaji}`};
      return state.kanaProgress[c.id]?[q]:[{type:'kana-teach',itemId:c.id,ja:c.ja,romaji:c.romaji,label:'Meet a new kana'},q];
    });
  }
  function grade(state,id,correct,today){const previous=state.kanaProgress[id],due=previous&&previous.due<=today;const box=correct?(due?Math.min(6,previous.box+1):previous?.box||1):1;state.kanaProgress[id]={box,due:!correct||!previous||due?Engine.addDays(today,Engine.INTERVALS[box-1]):previous.due,right:(previous?.right||0)+(correct?1:0),wrong:(previous?.wrong||0)+(correct?0:1)};}
  return {rows,cards,select,build,grade};
})();
if(typeof module!=='undefined')module.exports={Kana};
