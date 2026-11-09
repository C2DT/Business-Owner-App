const C='business-owner-v5-3-69-spouse-partnership';
const A=['./','./index.html','./manifest.json','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
// Install: bypass the browser HTTP cache so a freshly uploaded index.html is never replaced by a stale copy.
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>Promise.all(A.map(u=>fetch(u,{cache:'reload'}).then(r=>{if(!r.ok)throw new Error(u+' '+r.status);return c.put(u,r)})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('business-owner-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  // Never touch POSTs or cross-origin traffic (Supabase, Google): those go straight to the network.
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  const isPage=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  if(isPage){
    // Network first so app updates apply immediately; the cached copy is only an offline fallback.
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(C).then(c=>c.put(r,copy))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
