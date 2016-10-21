var CACHE = 'cache-and-update';

self.addEventListener('install', function(ev) {
  ev.waitUntil(precache());
});

self.addEventListener('fetch', function(ev) {
  ev.respondWith(fromCache(ev.request));
  ev.waitUntil(update(ev.request));
});

/**
 * Precache resourse
 * @func
 * @return {Promise} result of adding files to cache
 */
function precache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      './css/style.css',
      './javascript/bundle.js',
      './favicon.png',
      '/'
    ]);
  });
}

/**
 * Gaine resource from the cache
 * @func
 * @param  {request} request - current request
 * @return {Promise}
 */
function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

/**
 * Updating already cached resourse
 * @func
 * @param  {request}
 * @return {Promise}
 */
function update(request) {
  return caches.open(CACHE).then(function(cache) {
    return fetch(request).then(function(response) {
      return cache.put(request, response);
    });
  });
}