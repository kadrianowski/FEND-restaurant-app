const staticCache = 'restaurant-cache';

// list of assets to cache on install
// cache each restaurant detail page as well
self.addEventListener('install', event => {
    console.log('Sw install');
    event.waitUntil(
        caches.open(staticCache)
        .then(cache => {
            console.log('caching')
            return cache.addAll([
                '/',
                '/index.html',
                '/restaurant.html',
                '/css/styles.css',
                '/js/dbhelper.js',
                '/js/main.js',
                '/js/restaurant_info.js',
                '/data/restaurants.json',
                '/img/1.jpg',
                '/img/2.jpg',
                '/img/3.jpg',
                '/img/4.jpg',
                '/img/5.jpg',
                '/img/6.jpg',
                '/img/7.jpg',
                '/img/8.jpg',
                '/img/9.jpg',
                '/img/10.jpg',
                '/img/offline.png'
            ]).catch(error => {
                console.log('Caches open failed: ' + error);
            });
        })
    );
});


// intercept all requests
// either return cached asset or fetch from network
self.addEventListener('fetch', event => {
    event.respondWith(
        // Add cache.put to cache images on each fetch
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(staticCache).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(error => {
            if (event.request.url.includes('.jpg')) {
                return caches.match('/img/offline.png');
            }
            return new Response('Not connected to the internet', {
                status: 404,
                statusText: "Not connected to the internet. Check your connection"
            });
        })
    );
});

// delete old/unused static caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('restaurant-cache-') && cacheName !== staticCacheName;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});