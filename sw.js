// --- 設定區 ---
// ↓↓↓ 版本號改成 1.0.0.4 ↓↓↓
const CACHE_NAME = 'pwa-ver-1.0.0.4';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 安裝階段
self.addEventListener('install', (event) => {
    console.log('[SW] 安裝新版:', CACHE_NAME);
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 啟動階段
self.addEventListener('activate', (event) => {
    console.log('[SW] 新版啟動，清除舊快取');
    event.waitUntil(clients.claim());

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] 刪除舊快取:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 監聽前端訊息
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 攔截請求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
