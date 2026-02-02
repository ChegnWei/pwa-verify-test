// --- 設定區 ---
// 每次要版更時，請務必修改這裡的 CACHE_NAME
const CACHE_NAME = 'pwa-ver-1.0.0.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json'
];

// 安裝階段：快取檔案
self.addEventListener('install', (event) => {
    console.log('[SW] 安裝中:', CACHE_NAME);
    // 為了測試方便，我們強制 SW 立即進入 waiting 狀態，不用等舊的關閉
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] 正在快取檔案');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 啟動階段：清除舊快取
self.addEventListener('activate', (event) => {
    console.log('[SW] 啟動中');
    // 為了測試方便，讓新 SW 立即接管頁面
    event.waitUntil(clients.claim());

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 如果快取名稱跟現在的不一樣，就刪掉 (代表是舊版)
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] 刪除舊快取:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 攔截請求：優先使用快取，沒有才去網路抓
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果快取有，就回傳快取
                if (response) {
                    return response;
                }
                // 否則去網路抓
                return fetch(event.request);
            })
    );
});
