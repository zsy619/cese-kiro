/**
 * Sentry 错误追踪配置
 */

// 注意：需要安装 @sentry/react
// npm install @sentry/react

export const initSentry = () => {
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
        // 动态导入 Sentry
        // @ts-ignore - Sentry 是可选依赖，仅在生产环境使用
        import('@sentry/react').then((Sentry: any) => {
            Sentry.init({
                dsn: process.env.REACT_APP_SENTRY_DSN,
                environment: process.env.NODE_ENV,
                release: process.env.REACT_APP_VERSION || '1.0.0',

                // 性能监控
                tracesSampleRate: 0.1, // 10% 的请求进行性能追踪

                // 集成配置
                integrations: [
                    new Sentry.BrowserTracing({
                        // 路由追踪
                        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
                            // 需要传入 React Router 的 history 对象
                        )
                    }),
                    new Sentry.Replay({
                        // 会话回放配置
                        maskAllText: true,
                        blockAllMedia: true
                    })
                ],

                // 会话回放采样率
                replaysSessionSampleRate: 0.1, // 10% 的会话
                replaysOnErrorSampleRate: 1.0, // 100% 的错误会话

                // 错误过滤
                beforeSend(event: any, hint: any) {
                    // 过滤某些错误
                    const error = hint.originalException;
                    if (error && typeof error === 'object' && 'message' in error) {
                        const message = (error as Error).message;
                        // 忽略某些已知错误
                        if (message.includes('ResizeObserver')) {
                            return null;
                        }
                    }
                    return event;
                },

                // 用户信息
                initialScope: {
                    tags: {
                        app: 'cese-kiro-frontend'
                    }
                }
            });
        });
    }
};

/**
 * 设置用户信息
 */
export const setSentryUser = (user: { id: number; phone: string; nickname?: string }) => {
    if (process.env.NODE_ENV === 'production') {
        // @ts-ignore - Sentry 是可选依赖
        import('@sentry/react').then((Sentry: any) => {
            Sentry.setUser({
                id: user.id.toString(),
                username: user.nickname || user.phone,
                phone: user.phone
            });
        });
    }
};

/**
 * 清除用户信息
 */
export const clearSentryUser = () => {
    if (process.env.NODE_ENV === 'production') {
        // @ts-ignore - Sentry 是可选依赖
        import('@sentry/react').then((Sentry: any) => {
            Sentry.setUser(null);
        });
    }
};

/**
 * 手动捕获错误
 */
export const captureError = (error: Error, context?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'production') {
        // @ts-ignore - Sentry 是可选依赖
        import('@sentry/react').then((Sentry: any) => {
            Sentry.captureException(error, {
                extra: context
            });
        });
    } else {
        console.error('Error:', error, context);
    }
};

/**
 * 手动捕获消息
 */
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    if (process.env.NODE_ENV === 'production') {
        // @ts-ignore - Sentry 是可选依赖
        import('@sentry/react').then((Sentry: any) => {
            Sentry.captureMessage(message, level);
        });
    } else {
        console.log(`[${level}]`, message);
    }
};
