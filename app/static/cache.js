var CACHE = 'cache-and-update';

self.addEventListener('install', function(evt) {
  evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request));
});

/**
 * Precache resourse
 * @func
 * @return {Promise}
 */
function precache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      './css/style.css',
      './images/correct.svg',
      './images/incorrect.svg',
      './images/photo.svg',
      './images/progress.svg',
      './images/download.svg',
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