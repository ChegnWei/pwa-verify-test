// --- 設定區 ---
// ↓↓↓ 關鍵修改：版本號改成 1.0.0.3 ↓↓↓
const CACHE_NAME = 'pwa-ver-1.0.0.3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 安裝階段
self.addEventListener('install', (event) => {
    console.log('[SW] 安裝新版:', CACHE_NAME);
    // 強制進入 waiting 狀態
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
    // 讓新版 SW 立即接管頁面
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

// 監聽前端傳來的 skipWaiting 訊息 (雖然上面有 self.skipWaiting，但多加保險)
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
