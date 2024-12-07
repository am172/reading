self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/', // صفحة رئيسية
          '/index.html',
          '/styles.css',
          '/script.js',
          '/حضوووور-removebg-preview.png',
          '/حضوووور-removebg-preview.png',
         
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  });
  