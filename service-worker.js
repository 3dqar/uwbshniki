// ============================================
// ECON EMPIRE — Service Worker
// Caches static assets for offline use
// ============================================

const CACHE = 'econ-empire-v2';

const STATIC = [
  'index.html',
  'login.html',
  'app.html',
  'profile.html',
  'admin.html',
  'academy.html',
  'market.html',
  'empire.html',
  'leaderboard.html',
  'assets/css/app.css',
  'assets/js/api.js',
  'assets/js/user.js',
  'assets/js/ui.js',
  'manifest.json',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/favicon.ico',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only cache GET requests for same-origin assets; pass API calls through
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful same-origin responses
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('index.html'))
  );
});
