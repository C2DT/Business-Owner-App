const C='business-owner-v4-6';
const A=['./','./index.html','./manifest.json','./tile-points.png','./tile-team.png','./tile-run.png','./tile-plus.png','./tile-income.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
