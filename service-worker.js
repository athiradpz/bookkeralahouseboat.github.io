const CACHE_NAME = "bkh-v1";

// ✅ List only your own site’s assets – exclude external CDN URLs like tailwindcss.com
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon-32x32.png",
  "/favicon-16x16.png",
  "/manifest.json",
  "/assets/wesite video bkh.mp4"
  // Add other local assets if needed (e.g., CSS, JS, images)
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error("Cache installation failed:", error);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response or fetch from network
      return response || fetch(event.request);
    }).catch(error => {
      console.error("Fetch failed:", error);
    })
  );
});

