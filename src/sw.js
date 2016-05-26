// initialise variables for caching
var staticCacheName = 'transit-static-v27';
var allCaches = [
  staticCacheName
];

// install event - cache items
self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function (cache) {
          return cache.addAll([
            '/',
            '/index.html',
            '/css/app.min.css',            
            '/font/material-design-icons/MaterialIcons-Regular.eot',
            '/font/material-design-icons/MaterialIcons-Regular.woff2',
            '/font/material-design-icons/MaterialIcons-Regular.woff',
            '/font/material-design-icons/MaterialIcons-Regular.ttf',            
            '/font/roboto/Roboto-Bold.ttf',
            '/font/roboto/Roboto-Thin.ttf',
            '/font/roboto/Roboto-Regular.ttf',
            '/img/background.jpg',
            '/js/app.min.js',            
          ]);
      })
    );
});

// activate event - get rid of old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
          return Promise.all(
            cacheNames.filter(function (cacheName) {
                return cacheName.startsWith('transit-') &&
                       !allCaches.includes(cacheName);
            }).map(function (cacheName) {
                return caches.delete(cacheName);
            })
          );
      })
    );
});


// fetch event - return cached items or go to network
self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);

    event.respondWith(
      caches.match(event.request).then(function (response) {
          return response || fetch(event.request);
      })
    );
});

// message event - used for skip waiting so that the sw can update immediately
self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});