const CACHE_NAME = "bookkeralahouseboat-cache-v1";
const OFFLINE_URL = "/offline.html";

const assetsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/assets/tailwind.min.css",
  "/assets/wesite video bkh.mp4",
  "/assets/New BHK.png",
  "/favicon.ico",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/apple-touch-icon.png",
  "/site.webmanifest"
];

// Install: cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(assetsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve cached, fallback to offline
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
      .then(response => response || caches.match(OFFLINE_URL))
  );
});
