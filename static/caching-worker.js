let cacheName = 'wiktionary-anagram-cache-v1'

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];

  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            console.log('Deleting cache: ' + key)
            return caches.delete(key);
          }
        }))
      )
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        const urlsToCache = []

        for (let i = 1; i <= 10; i++) {
          urlsToCache.push("/words-by-product/" + i + ".txt")
        }

        cache.addAll(urlsToCache)
      })
  );
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
      })
  );
});

self.addEventListener('message', function(event) {
  for (let permutation of permutationGenerator(event.data)) {
    event.ports[0].postMessage(permutation.join(''))
  }
})
