const CACHE_NAME = 'business-owner-static-v4-7';
const CACHE_PREFIX = 'business-owner-';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './tile-points.png',
  './tile-team.png',
  './tile-run.png',
  './tile-plus.png',
  './tile-income.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Always prefer the live GitHub Pages HTML when online.
  // This prevents an old cached index.html from pinning the app to an older version.
  if (request.mode === 'navigate' ||
      request.destination === 'document' ||
      request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Network-first for the service worker itself so updates are discovered promptly.
  if (new URL(request.url).pathname.endsWith('/sw.js')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static app assets: use cache when available, then refresh from the network.
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok && new URL(request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
