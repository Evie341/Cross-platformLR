self.addEventListener("install",event =>{
    console.log("Service Workers installing...",event);
    event.waitUntil(
      caches.open("static").then(cache => {
        console.log("Servise Workers Precache...", cache);
        cache.add("/src/js/app.js");
      })
    );
  });  
  
  self.addEventListener('activate', function(event) {
    console.log('Service Worker активовано!', event);
  });
  
  self.addEventListener("fetch",event =>{
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        } else {
          return fetch(event.request);
        }
      })
    );
  });
  
  
 