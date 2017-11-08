var version = 'v1::';
var CACHE_NAME = 'andvagorion.github.io';
var urlsToCache = [
  '/',
  '/index.html',
  '/index_offline.html'
];

self.addEventListener('install', function(event) {
  console.log('WORKER: install event in progress.');

  // Perform install steps
  event.waitUntil(
    caches.open(version + CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
    .then(function() {
      console.log('WORKER: install completed');
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('WORKER: fetch event in progress.');

  // ignore non-GET events
  if (event.request.method !== 'GET') {
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

  if (event.request.mode === 'navigate' ||
  (event.request.method === 'GET' &&
  event.request.headers.get('accept').includes('text/html'))) {

    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(error => {
        // The catch is only triggered if fetch() throws an exception, which will most likely
        // happen due to the server being unreachable.
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
        // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
        // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(OFFLINE_URL);
      })
    }

    /*
    event.respondWith(async function() {

    console.log(event.request);

    caches
    .match(event.request)
    .then(function(response) {
    // Cache hit - return response
    if (response) {
    return response;
  }
  return fetch(
  event.request,
  {
  credentials: 'include'
}
);
});

});
*/
});

/* The activate event fires after a service worker has been successfully installed.
It is most useful when phasing out an older version of a service worker, as at
this point you know that the new worker was installed correctly. In this example,
we delete old caches that don't match the version in the worker we just finished
installing.
*/
self.addEventListener("activate", function(event) {
  /* Just like with the install event, event.waitUntil blocks activate on a promise.
  Activation will fail unless the promise is fulfilled.
  */
  console.log('WORKER: activate event in progress.');

  event.waitUntil(
    caches
    /* This method returns a promise which will resolve to an array of available
    cache keys.
    */
    .keys()
    .then(function (keys) {
      // We return a promise that settles when all outdated caches are deleted.
      return Promise.all(
        keys
        .filter(function (key) {
          // Filter by keys that don't start with the latest version prefix.
          return !key.startsWith(version);
        })
        .map(function (key) {
          /* Return a promise that's fulfilled
          when each outdated cache is deleted.
          */
          return caches.delete(key);
        })
      );
    })
    .then(function() {
      console.log('WORKER: activate completed.');
    })
  );
});
