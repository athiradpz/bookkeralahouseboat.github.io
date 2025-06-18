const CACHE_NAME = "bkh-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/assets/tailwind.min.css",
  "/assets/logo.png",
  "/assets/banner.mp4",
  "/manifest.json",
  "/favicon.ico"
];

// Install the service worker and cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch cached resources if offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("/offline.html") // optional fallback
        )
      );
    })
  );
});

