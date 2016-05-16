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
            '/src/',
            '/src/index.html',
            '/src/css/style.css',
            '/src/css/vendor/animate.css',
            '/src/css/vendor/bootstrap-material-datetimepicker.css',
            '/src/css/vendor/materialize.css',            
            '/src/font/material-design-icons/MaterialIcons-Regular.eot',
            '/src/font/material-design-icons/MaterialIcons-Regular.woff2',
            '/src/font/material-design-icons/MaterialIcons-Regular.woff',
            '/src/font/material-design-icons/MaterialIcons-Regular.ttf',            
            '/src/font/roboto/Roboto-Bold.ttf',
            '/src/font/roboto/Roboto-Thin.ttf',
            '/src/font/roboto/Roboto-Regular.ttf',
            '/src/img/background.jpg',
            '/src/js/constants.js',
            '/src/js/index.js',
            '/src/js/schedules.js',
            '/src/js/stations.js',
            '/src/js/validation.js',
			      '/src/js/transitIdb.js',
            '/src/js/vendor/bootstrap-material-datetimepicker.js',
            '/src/js/vendor/idb.js',
            '/src/js/vendor/jquery-2.1.1.min.js',
            '/src/js/vendor/materialize.js',            
            '/src/js/vendor/moment.min.js',
            '/src/js/vendor/xml2json.js'                                 
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