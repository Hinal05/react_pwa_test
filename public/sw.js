let cacheData = "appV1";

this.addEventListener("install", (event) => {
  event.waitUntil (
    caches.open(cacheData).then((cache) => {
      cache.addAll([
        "/",
        "/index.html",
        "/static/js/bundle.js",
        "/users",
        "/about"
      ])
    })
  )
})

this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    event.respondWith(caches.open(cacheData).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if(cachedResponse) {
          return cachedResponse;
        }

        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      });
    }));
  }
})

this.addEventListener("activate", (event) => {
  console.log('service worker has been activated.');
})
