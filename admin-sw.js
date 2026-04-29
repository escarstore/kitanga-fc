// admin-sw.js — AL Sports Admin Service Worker
const CACHE = 'al-admin-v2';

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(c => 
            c.addAll(['/kitanga-fc/admin.html']).catch(() => {})
        )
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Network first — admin always needs fresh data
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request)
            .catch(() => caches.match(e.request))
    );
});
