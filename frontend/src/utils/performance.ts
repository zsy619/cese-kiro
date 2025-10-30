/**
 * 性能优化工具函数
 */

/**
 * 图片懒加载
 */
export function lazyLoadImage(imageElement: HTMLImageElement): void {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        imageObserver.observe(imageElement);
    } else {
        // 降级方案：直接加载图片
        const src = imageElement.dataset.src;
        if (src) {
            imageElement.src = src;
        }
    }
}

/**
 * 预加载关键资源
 */
export function preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;

    switch (type) {
        case 'script':
            link.as = 'script';
            break;
        case 'style':
            link.as = 'style';
            break;
        case 'image':
            link.as = 'image';
            break;
        case 'font':
            link.as = 'font';
            link.crossOrigin = 'anonymous';
            break;
    }

    document.head.appendChild(link);
}

/**
 * 预连接到外部域名
 */
export function preconnect(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
}

/**
 * 测量性能指标
 */
export function measurePerformance(name: string, callback: () => void): void {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);

    // 可以发送到分析服务
    if (process.env.NODE_ENV === 'production') {
        // sendToAnalytics({ metric: name, duration });
    }
}

/**
 * 获取 Web Vitals 指标
 */
export async function getWebVitals(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

        getCLS((metric) => console.log('CLS:', metric));
        getFID((metric) => console.log('FID:', metric));
        getFCP((metric) => console.log('FCP:', metric));
        getLCP((metric) => console.log('LCP:', metric));
        getTTFB((metric) => console.log('TTFB:', metric));
    }
}

/**
 * 检测网络状态
 */
export function getNetworkStatus(): {
    online: boolean;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
} {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
        online: navigator.onLine,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt
    };
}

/**
 * 内存使用情况
 */
export function getMemoryUsage(): {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
} | null {
    const memory = (performance as any).memory;

    if (memory) {
        return {
            usedJSHeapSize: memory.usedJSHeapSize,
            totalJSHeapSize: memory.totalJSHeapSize,
            jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
    }

    return null;
}

/**
 * 批量处理任务（避免阻塞主线程）
 */
export async function batchProcess<T>(
    items: T[],
    processor: (item: T) => void | Promise<void>,
    batchSize: number = 10
): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        await Promise.all(batch.map(processor));

        // 让出主线程
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
}

/**
 * 使用 requestIdleCallback 执行低优先级任务
 */
export function runWhenIdle(callback: () => void, options?: { timeout?: number }): void {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, options);
    } else {
        // 降级方案
        setTimeout(callback, 1);
    }
}

/**
 * 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>) => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);

        return result;
    }) as T;
}
