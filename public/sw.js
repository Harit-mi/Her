// Sunrise PWA Offline App-Shell Service Worker (Network-First for HTML pages)
const CACHE_NAME = "sunrise-shell-v3-reset";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Purge all old caches (v1, v2) immediately on update
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Never cache API routes or non-GET requests
  if (event.request.method !== "GET" || event.request.url.includes("/api/")) {
    return;
  }

  // Network-First for HTML navigation requests to prevent stale cached app shells
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => cached || fetch(event.request));
        })
    );
    return;
  }

  // Cache-First for static assets (images, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
