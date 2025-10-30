/* eslint-disable no-restricted-globals */

// Service Worker 版本
const CACHE_VERSION = 'v1';
const CACHE_NAME = `cese-kiro-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
    '/manifest.json',
    '/favicon.ico'
];

// 需要缓存的 API 请求
const API_CACHE_URLS = ['/api/templates', '/api/config'];

// 安装事件
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 安装中...');

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] 缓存静态资源');
            return cache.addAll(STATIC_CACHE_URLS);
        })
    );

    // 强制激活新的 Service Worker
    self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] 激活中...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] 删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // 立即控制所有页面
    return self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 只处理同源请求
    if (url.origin !== location.origin) {
        return;
    }

    // API 请求：网络优先，失败时使用缓存
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // 克隆响应
                    const responseClone = response.clone();

                    // 缓存成功的响应
                    if (response.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }

                    return response;
                })
                .catch(() => {
                    // 网络失败，尝试从缓存获取
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            console.log('[Service Worker] 从缓存返回 API 响应:', url.pathname);
                            return cachedResponse;
                        }

                        // 返回离线页面或错误响应
                        return new Response(
                            JSON.stringify({
                                error: '网络连接失败，请检查网络设置'
                            }),
                            {
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                    });
                })
        );
        return;
    }

    // 静态资源：缓存优先，失败时使用网络
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                console.log('[Service Worker] 从缓存返回:', url.pathname);
                return cachedResponse;
            }

            return fetch(request).then((response) => {
                // 只缓存成功的 GET 请求
                if (request.method === 'GET' && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }

                return response;
            });
        })
    );
});

// 消息事件
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        });
    }
});

// 后台同步
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-templates') {
        event.waitUntil(syncTemplates());
    }
});

// 同步模板数据
async function syncTemplates() {
    try {
        const response = await fetch('/api/templates');
        const data = await response.json();

        // 更新缓存
        const cache = await caches.open(CACHE_NAME);
        await cache.put('/api/templates', new Response(JSON.stringify(data)));

        console.log('[Service Worker] 模板数据同步成功');
    } catch (error) {
        console.error('[Service Worker] 模板数据同步失败:', error);
    }
}
