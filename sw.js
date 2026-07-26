// ============================================================
// SERVICE WORKER — the little helper that makes your app a PWA.
// It caches the app's files so the planner OPENS EVEN WITH NO
// INTERNET — required for the Google Play packaging step.
// ============================================================
const CACHE = 'my-planner-v1';   // bump to v2, v3... when you update the app
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

// install: save the app's files into the cache drawer
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

// activate: throw away caches from old versions
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

// fetch: try the internet first, fall back to the cache when offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
