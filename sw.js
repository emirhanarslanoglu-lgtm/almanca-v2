const CACHE_NAME = 'b2-flashcard-v52';
const ASSETS = [
    './',
    './index.html',
    './grammar.html',
    './style.css',
    './app.js',
    './data.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Dosyalar cihazın önbelleğine (cache) alınıyor...');
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('Eski önbellek temizleniyor:', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});