// initialise variables for caching
var staticCacheName = 'transit-static-v27';
var srcCacheFiles = ['/','/index.html','/css/style.css','/css/vendor/animate.css','/css/vendor/bootstrap-material-datetimepicker.css','/css/vendor/materialize.css','/font/material-design-icons/MaterialIcons-Regular.eot','/font/material-design-icons/MaterialIcons-Regular.woff2','/font/material-design-icons/MaterialIcons-Regular.woff','/font/material-design-icons/MaterialIcons-Regular.ttf','/font/roboto/Roboto-Bold.ttf','/font/roboto/Roboto-Thin.ttf','/font/roboto/Roboto-Regular.ttf','/img/background.jpg', '/js/constants.js','/js/index.js','/js/schedules.js','/js/stations.js','/js/validation.js','/js/transitIdb.js','/js/vendor/bootstrap-material-datetimepicker.js','/js/vendor/idb.js','/js/vendor/jquery-2.1.1.min.js','/js/vendor/materialize.js','/js/vendor/moment.min.js','/js/vendor/xml2json.js'];
var distCacheFiles = ['/','/index.html','/css/app.min.css','/font/material-design-icons/MaterialIcons-Regular.eot','/font/material-design-icons/MaterialIcons-Regular.woff2','/font/material-design-icons/MaterialIcons-Regular.woff','/font/material-design-icons/MaterialIcons-Regular.ttf','/font/roboto/Roboto-Bold.ttf','/font/roboto/Roboto-Thin.ttf','/font/roboto/Roboto-Regular.ttf','/img/background.jpg','/js/app.min.js'];
var allCaches = [
  staticCacheName
];

// install event - cache items
self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function (cache) {
          return cache.addAll(srcCacheFiles);
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