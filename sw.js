const CACHE_NAME = 'royal-city-map-v33';
const ASSETS_TO_CACHE = [
  './royal-city-alliance-map.html',
  './territory-map.html',
  './sanctuary-upgrades.html',
  './hero-guide.html',
  './alliance-duel-guide.html',
  './alliance-guide.html',
  './arena-guide.html',
  './building-guide.html',
  './celias-hunting-guide.html',
  './cheese-trap-guide.html',
  './crystal-cluster-valley-guide.html',
  './demon-king-guide.html',
  './diamond-guide.html',
  './do-today.html',
  './elixir-scramble-guide.html',
  './event-guides.html',
  './falcon-quests-guide.html',
  './game-guides.html',
  './gear-guide.html',
  './hunt-battle-guide.html',
  './might-guide.html',
  './research-guide.html',
  './resource-investment-guide.html',
  './resource-mistakes-guide.html',
  './resource-raiding-guide.html',
  './resource-risk-map-guide.html',
  './resource-routine-guide.html',
  './resource-storage-protection-guide.html',
  './resource-types-guide.html',
  './resources.html',
  './server-time-chart.html',
  './shields-guide.html',
  './shop-guide.html',
  './skin-buffs.html',
  './squad-building-guide.html',
  './survival-battle-guide.html',
  './thief-hunt-guide.html',
  './undead-siege.html',
  './hero-images/hero-marlena.jpg',
  './hero-images/hero-annie.jpg',
  './hero-images/hero-jester.jpg',
  './hero-images/hero-red-lady.jpg',
  './hero-images/hero-nicole.jpg',
  './hero-images/hero-billy.jpg',
  './hero-images/hero-cynthia.jpg',
  './skin-images/skin-black-raven-fortress.jpg',
  './skin-images/skin-eagle-castle.jpg',
  './skin-images/skin-fantasy-city.jpg',
  './skin-images/skin-greenery.jpg',
  './skin-images/skin-land-of-purgatory.jpg',
  './skin-images/skin-mystic-cabin.jpg',
  './skin-images/skin-rabbit-s-tea-party.jpg',
  './indicator-icons/faction-warrior.png',
  './indicator-icons/faction-ranger.png',
  './indicator-icons/faction-warlock.png',
  './indicator-icons/class-carry.png',
  './indicator-icons/class-tank.png',
  './indicator-icons/class-support.png',
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
