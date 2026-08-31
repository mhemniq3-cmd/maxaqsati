const CACHE_NAME = 'installment-iqd-pwa-v13';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    // Direct network fetching to avoid stale caching during development
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
