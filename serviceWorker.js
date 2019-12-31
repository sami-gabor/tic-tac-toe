const cacheName = 'tic-tac-toe-game';
const filesToCache = [
  '/',
  '/public/javascripts/client.js',
  '/public/stylesheets/login.css',
  '/public/stylesheets/styles.css',
  '/routes/routes.js',
  '/views',
  '/views/index.html',
  '/views/login.html',
  '/views/ranking.html',
  '/views/register.html',
  '/js/main.js',
  '/server.js',
  '/utils.js',
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
