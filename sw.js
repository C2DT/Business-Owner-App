const C='business-owner-v5-2-26-neon-clickable-tiles';
const A=['./','./index.html','./manifest.json','./assets/tile-100-300-points.png','./assets/tile-team-of-10.png','./assets/tile-platinum-run.png','./assets/tile-platinum-plus.png','./assets/tile-income-estimator.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('business-owner-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
