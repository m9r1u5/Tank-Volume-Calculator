/* Service worker: makes the app work OFFLINE.
   - On install it downloads every app file into a cache.
   - Page/script requests: network first (3 s limit) so updates show up, otherwise the cached copy.
   - Images: cache first.
   Bump CACHE_VERSION whenever you change any file (and APP in index.html to match). */
const CACHE_VERSION = 'tank-calc-v8';
const FILES = ['./index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './maskable-512.png', './apple-touch-icon.png'];
const NET_TIMEOUT = 3000;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE_VERSION);
    // index.html is stored under both ./index.html and ./ (the address the installed app starts at)
    try {
      const r = await fetch('./index.html', { cache: 'reload' });
      if (r.ok) { await c.put('./index.html', r.clone()); await c.put('./', r.clone()); }
    } catch (err) {}
    await Promise.all(FILES.slice(1).map(async f => {
      try { const r = await fetch(f, { cache: 'reload' }); if (r.ok) await c.put(f, r); } catch (err) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const opts = { ignoreSearch: true, ignoreVary: true };

function networkFirst(req, keys) {
  const net = fetch(req).then(res => {
    if (res.ok && !res.redirected) {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then(c => keys.forEach(k => c.put(k, copy.clone())));
    }
    return res;
  });
  const timer = new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), NET_TIMEOUT));
  // no signal / slow signal / offline -> serve the saved copy
  return Promise.race([net, timer]).catch(() =>
    caches.match(keys[0], opts).then(hit => hit || caches.match('./index.html', opts) || net));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const path = new URL(req.url).pathname;
  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req, ['./index.html', './']));
  } else if (/\.(js|webmanifest)$/.test(path)) {
    e.respondWith(networkFirst(req, [req.url]));
  } else {
    e.respondWith(caches.match(req, opts).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE_VERSION).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
