const CACHE_NAME = ‘blendtrak-v1’;
const ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap’,
‘https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js’
];

self.addEventListener(‘install’, e => {
e.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(ASSETS).catch(() => {});
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

self.addEventListener(‘fetch’, e => {
if (e.request.method !== ‘GET’) return;
e.respondWith(
caches.match(e.request).then(cached => {
if (cached) return cached;
return fetch(e.request).then(res => {
if (res.ok) {
const clone = res.clone();
caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
}
return res;
}).catch(() => cached);
})
);
});
