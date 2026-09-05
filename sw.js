// ============================================================
// SERVICE WORKER — the little helper that makes your app a PWA.
// It sits between your app and the internet. Here it caches the
// app's files so the planner OPENS EVEN WITH NO INTERNET —
// that's what makes a web page feel like a real installed app,
// and it's required for the Google Play packaging step.
// ============================================================
const CACHE = 'my-planner-v27';   // bump the number every app update
const FILES = ['./', './index.html', './manifest.json', './privacy-policy.html', './icon-192.png', './icon-512.png'];

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

// notification click: bring the planner's window to the front
// (or open it if it isn't already open). This is why the app's
// reminders feel like real app notifications.
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
