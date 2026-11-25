'use strict';
const CACHE='mi-install-v012-e0468290';
const HASH='e04682909336c829a57494e5547a22a54e80241b37fd7cb77225cd0fc72e18ed';
const root=new URL('./',location.href),app=new URL('app/',root),mark=new URL('__ready__',app);
const types={'index.html':'text/html; charset=utf-8','manifest.webmanifest':'application/manifest+json','src/app.css':'text/css; charset=utf-8','src/app.js':'application/javascript; charset=utf-8','src/data.js':'application/javascript; charset=utf-8','src/workspace.js':'application/javascript; charset=utf-8','src/pwa.js':'application/javascript; charset=utf-8','vendor/maplibre.js':'application/javascript; charset=utf-8','vendor/maplibre.css':'text/css; charset=utf-8','assets/icon-192.png':'image/png','assets/icon-512.png':'image/png','vendor/LICENSE.txt':'text/plain; charset=utf-8'};
const $=id=>document.getElementById(id),status=s=>{$('status').textContent=s};
const installedScript=`(()=>{const s=document.getElementById('pwaStatus'),b=document.getElementById('installPwa');let p;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();p=e;b.hidden=false;s.textContent='Kurulum hazır.'});b.onclick=async()=>{if(p){await p.prompt();await p.userChoice;p=null;b.hidden=true}};window.addEventListener('appinstalled',()=>{s.textContent='Uygulama kuruldu.';b.hidden=true});s.textContent=matchMedia('(display-mode: standalone)').matches?'Uygulama kurulu.':'Tarayıcı menüsünden ana ekrana ekleyebilirsiniz.';})();`;
async function ready(){const c=await caches.open(CACHE);return !!(await c.match(mark.href))}
async function init(){
 if(!isSecureContext||!('serviceWorker'in navigator)||!('caches'in window)||!crypto.subtle||!('DecompressionStream'in window))throw Error('Chrome veya Edge ile HTTPS üzerinden açın.');
 await navigator.serviceWorker.register('./installer-sw.js',{scope:'./'});
 await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Kurulum altyapısı zaman aşımına uğradı. Sayfayı yenileyin.')),15000))]);
 if(!navigator.serviceWorker.controller){await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('Sayfayı yenileyip tekrar deneyin.')),8000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(t);resolve()},{once:true});if(navigator.serviceWorker.controller){clearTimeout(t);resolve()}})}
 $('file').disabled=false;
 if(await ready()){$('launch').hidden=false;status('Uygulama bu cihazda hazır. Açabilirsiniz.');}else status('İndirilenler klasöründeki Magaza-Izi-v0.12-PWA.zip dosyasını seçin.');
}
function entries(buffer){
 const v=new DataView(buffer),bytes=new Uint8Array(buffer);let end=-1;
 for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(v.getUint32(i,true)===0x06054b50&&i+22+v.getUint16(i+20,true)===bytes.length){end=i;break}}
 if(end<0)throw Error('ZIP dizini okunamadı.');
 const count=v.getUint16(end+10,true),out=new Map();let offset=v.getUint32(end+16,true);
 if(count>100)throw Error('Beklenmeyen arşiv.');
 for(let j=0;j<count;j++){
  if(v.getUint32(offset,true)!==0x02014b50)throw Error('ZIP dizini bozuk.');
  const flags=v.getUint16(offset+8,true),method=v.getUint16(offset+10,true),size=v.getUint32(offset+20,true),plain=v.getUint32(offset+24,true),n=v.getUint16(offset+28,true),x=v.getUint16(offset+30,true),comment=v.getUint16(offset+32,true),local=v.getUint32(offset+42,true);
  const name=new TextDecoder().decode(bytes.subarray(offset+46,offset+46+n));offset+=46+n+x+comment;
  if(!Object.hasOwn(types,name))continue;
  if(out.has(name)||flags&1||plain>2000000||v.getUint32(local,true)!==0x04034b50)throw Error('Geçersiz ZIP girdisi.');
  const start=local+30+v.getUint16(local+26,true)+v.getUint16(local+28,true);
  if(start+size>bytes.length)throw Error('Eksik ZIP girdisi.');
  out.set(name,{method,plain,data:bytes.subarray(start,start+size)});
 }
 for(const name of Object.keys(types))if(!out.has(name))throw Error('Eksik dosya: '+name);
 return out;
}
async function unpack(e){let result;if(e.method===0)result=e.data;else if(e.method===8)result=new Uint8Array(await new Response(new Blob([e.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());else throw Error('Desteklenmeyen ZIP sıkıştırması.');if(result.length!==e.plain)throw Error('Dosya boyutu uyuşmuyor.');return result}
$('file').addEventListener('change',async()=>{
 const file=$('file').files[0];if(!file)return;
 $('file').disabled=true;$('progress').hidden=false;$('progress').value=0;
 try{
  if(file.size>5000000)throw Error('Yanlış paket veya dosya çok büyük.');
  status('Paket doğrulanıyor…');const bytes=await file.arrayBuffer();
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
  if(hash!==HASH)throw Error('Bu dosya doğrulanmış v0.12 paketi değil. ChatGPT üzerinden gönderilen son ZIP dosyasını seçin.');
  const files=entries(bytes),responses=[];let i=0;
  for(const [name,e] of files){
   let data=await unpack(e);if(name==='src/pwa.js')data=installedScript;
   if(name==='manifest.webmanifest'){const m=JSON.parse(new TextDecoder().decode(data));m.start_url='./index.html';data=JSON.stringify(m)}
   responses.push([new URL(name,app).href,new Response(data,{headers:{'Content-Type':types[name],'Cache-Control':'no-store'}})]);
   $('progress').value=Math.round(++i/files.size*75);
  }
  const c=await caches.open(CACHE);
  await Promise.all(responses.map(([url,response])=>c.put(url,response)));
  await c.put(mark.href,new Response('ready'));
  $('progress').value=100;$('launch').hidden=false;status('Kurulum tamamlandı. Mağaza İzi’ni aç düğmesine dokunun.');
 }catch(e){status('Kurulum tamamlanamadı: '+e.message)}finally{$('file').disabled=false;$('file').value='';$('progress').hidden=true}
});
init().catch(e=>status('Kurulum altyapısı açılamadı: '+e.message));
