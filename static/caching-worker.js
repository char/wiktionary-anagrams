const cacheName = 'wiktionary-anagram-cache-v3'

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName]

  event.waitUntil(
    caches.keys()
    .then(keyList =>
      Promise.all(keyList.map((key) => {
        if (!cacheWhitelist.includes(key)) {
          console.log('Deleting cache: ' + key)
          return caches.delete(key)
        }
      }))
    )
  )
})

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
    .then((cache) => {
      const urlsToCache = []

      for (let i = 1; i <= 15; i++) {
        urlsToCache.push("/words-by-product/" + i + ".txt")
      }

      cache.addAll(urlsToCache)
    })
  );
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes("/words-by-product/")) {
    event.respondWith(
      caches.open(cacheName).then((cache) => {
        cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((response) => {
            cache.put(event.request, response.clone())

            return response
          })
        })
      })
    )
  }
});

self.addEventListener('message', (event) => {
  for (let permutation of permutationGenerator(event.data)) {
    event.ports[0].postMessage(permutation.join(''))
  }
})
