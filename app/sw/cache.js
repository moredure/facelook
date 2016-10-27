'use strict';
const CACHE = 'v1';

self.addEventListener('install', function(ev) {
  ev.waitUntil(precache());
});

self.addEventListener('fetch', function(ev) {
  if(ev.request.method === 'GET') {
    ev.respondWith(fromCache(ev.request));
  }
});

/**
 * Precache resourse
 * @return {Promise} result of adding files to cache
 */
function precache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
      '/static/css/style.css',
      '/static/javascript/bundle.js',
      '/static/favicon.png',
      '/'
    ]);
  });
}

/**
 * Gaine resource from the cache
 * @param  {request} request - current request
 * @return {Promise} return matched request
 */
function fromCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      return matching || fetch(request);
    });
  });
}
