/**
 * Service Worker 注册和管理
 */

export function registerServiceWorker() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log('[SW] 注册成功:', registration.scope);

                    // 检查更新
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // 新的 Service Worker 已安装，提示用户刷新
                                    if (
                                        window.confirm(
                                            '发现新版本，是否立即更新？\n点击确定将刷新页面以应用更新。'
                                        )
                                    ) {
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                        window.location.reload();
                                    }
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error('[SW] 注册失败:', error);
                });

            // 监听 Service Worker 控制器变化
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[SW] 控制器已更新');
            });
        });
    }
}

export function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
                console.log('[SW] 已注销');
            })
            .catch((error) => {
                console.error('[SW] 注销失败:', error);
            });
    }
}

/**
 * 清除所有缓存
 */
export async function clearAllCaches() {
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log('[SW] 所有缓存已清除');
    }
}

/**
 * 检查是否在线
 */
export function isOnline(): boolean {
    return navigator.onLine;
}

/**
 * 监听在线/离线状态
 */
export function setupOnlineListener(
    onOnline: () => void,
    onOffline: () => void
): () => void {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // 返回清理函数
    return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
    };
}
