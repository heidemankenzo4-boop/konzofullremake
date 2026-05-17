const fs=require('fs');
let raw=fs.readFileSync(__dirname+'/cards-data.js','utf8');
raw=raw.replace(/^export default\s+/,'').replace(/;\s*$/,'');
let data;
try{data=(new Function('return '+raw))()}catch(e){console.log('Parse error:',e.message);process.exit(1)}
const filtered=data.filter(g=>!g.skip&&g.href&&g.href.startsWith('./html/'));
const seen=new Set();
const unique=filtered.filter(g=>{if(seen.has(g.name))return false;seen.add(g.name);return true});
console.log('Total:'+data.length+' HTML:'+filtered.length+' Unique:'+unique.length);
let out=unique.map(g=>{
  const name=g.name.replace(/'/g,"\\'");
  const page=g.page||3;
  const gameUrl='https://strongdog.com'+g.href.replace(/^\.\//,'/');
  const imgUrl='https://strongdog.com/'+page+'/img/'+g.imgSrc;
  return '["'+name+'","'+gameUrl+'","'+imgUrl+'"]';
});
fs.writeFileSync(__dirname+'/games-array.txt','var G_DATA=[\n'+out.join(',\n')+'\n];');
console.log('Wrote '+out.length+' games to games-array.txt');
