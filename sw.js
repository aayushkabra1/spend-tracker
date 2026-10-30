// Service worker: caches the app files so the app works offline.
// Change CACHE_NAME when you update any app file, so phones get the new version.
const CACHE_NAME = "spend-tracker-v4";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache first, then network. Only for the app's own files:
// requests to Google (sync) go straight to the network, not through the service worker.
self.addEventListener("fetch", (event) => {
  const isOwnFile = event.request.method === "GET" && new URL(event.request.url).origin === self.location.origin;
  if (!isOwnFile) return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request))
  );
});
