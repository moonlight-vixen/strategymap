const CACHE_NAME = 'royal-city-map-v12';
const ASSETS_TO_CACHE = [
  './royal-city-alliance-map.html',
  './sanctuary-upgrades.html',
  './hero-guide.html',
  './hero-images/hero-marlena.jpg',
  './hero-images/hero-annie.jpg',
  './hero-images/hero-jester.jpg',
  './hero-images/hero-red-lady.jpg',
  './hero-images/hero-billy.jpg',
  './hero-images/hero-cynthia.jpg',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-192-maskable.png',
  './icon-512-maskable.png'
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Let the page (via the "Check for Updates" button) force an already-installed,
// waiting service worker to activate immediately rather than waiting for all tabs to close.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate: clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: try the network first (so you always get the latest version when online),
// fall back to the cached copy when offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./royal-city-alliance-map.html')))
  );
});
