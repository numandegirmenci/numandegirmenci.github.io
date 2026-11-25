'use strict';
const CACHE='mi-install-v012-e0468290',SHELL='mi-installer-shell-v013';
const root=new URL('./',self.location.href),app=new URL('app/',root),mark=new URL('__ready__',app);
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.addAll([new URL('index.html',root).href,new URL('installer.js',root).href,new URL('app-patch-v013.js',root).href])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return;
 if(url.pathname.startsWith(app.pathname)){
  e.respondWith((async()=>{const c=await caches.open(CACHE);if(!await c.match(mark.href)){if(e.request.mode==='navigate')return Response.redirect(new URL('index.html',root).href,302);return new Response('Kurulum gerekli',{status:404})}
   const target=url.pathname===app.pathname?new URL('index.html',app):url;target.search='';target.hash='';
   if(target.href===mark.href)return new Response('Not found',{status:404});
   const cached=await c.match(target.href);if(!cached)return new Response('Not found',{status:404});
   if(target.pathname===new URL('src/app.js',app).pathname){
    const shell=await caches.open(SHELL),patch=await shell.match(new URL('app-patch-v013.js',root).href);
    if(patch)return new Response((await cached.text())+'\n'+(await patch.text()),{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
   }
   return cached;
  })());return;
 }
 if(url.pathname===root.pathname||url.pathname===new URL('index.html',root).pathname||url.pathname===new URL('installer.js',root).pathname){
  e.respondWith(fetch(e.request).catch(async()=>{const c=await caches.open(SHELL);return (await c.match(url.pathname===root.pathname?new URL('index.html',root).href:url.href))||new Response('Çevrimdışı',{status:503})}));
 }
});