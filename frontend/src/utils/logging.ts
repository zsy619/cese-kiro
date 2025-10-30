/**
 * 日志聚合系统
 * 统一管理应用日志，支持不同级别和分类
 */

import { captureMessage, captureError } from '../config/sentry';

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export interface LogEntry {
    id: string;
    level: LogLevel;
    category: string;
    message: string;
    timestamp: number;
    data?: any;
    stack?: string;
    userAgent?: string;
    url?: string;
}

export interface LoggerConfig {
    enabled: boolean;
    level: LogLevel;
    maxEntries: number;
    sendToServer: boolean;
    serverEndpoint?: string;
    categories: string[];
}

class Logger {
    private config: LoggerConfig = {
        enabled: true,
        level: LogLevel.INFO,
        maxEntries: 1000,
        sendToServer: false,
        categories: ['app', 'api', 'performance', 'user', 'error']
    };

    private logs: LogEntry[] = [];
    private listeners: Array<(log: LogEntry) => void> = [];

    constructor() {
        this.loadConfig();
    }

    /**
     * 加载配置
     */
    private loadConfig() {
        try {
            const saved = localStorage.getItem('logger_config');
            if (saved) {
                this.config = { ...this.config, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('加载日志配置失败:', error);
        }
    }

    /**
     * 保存配置
     */
    saveConfig(config: Partial<LoggerConfig>) {
        this.config = { ...this.config, ...config };
        try {
            localStorage.setItem('logger_config', JSON.stringify(this.config));
        } catch (error) {
            console.error('保存日志配置失败:', error);
        }
    }

    /**
     * 检查是否应该记录日志
     */
    private shouldLog(level: LogLevel): boolean {
        if (!this.config.enabled) {
            return false;
        }

        const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
        const currentLevelIndex = levels.indexOf(this.config.level);
        const logLevelIndex = levels.indexOf(level);

        return logLevelIndex >= currentLevelIndex;
    }

    /**
     * 创建日志条目
     */
    private createLogEntry(
        level: LogLevel,
        category: string,
        message: string,
        data?: any,
        error?: Error
    ): LogEntry {
        return {
            id: `log-${Date.now()}-${Math.random()}`,
            level,
            category,
            message,
            timestamp: Date.now(),
            data,
            stack: error?.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    /**
     * 记录日志
     */
    private log(level: LogLevel, category: string, message: string, data?: any, error?: Error) {
        if (!this.shouldLog(level)) {
            return;
        }

        const entry = this.createLogEntry(level, category, message, data, error);

        // 保存到内存
        this.logs.push(entry);

        // 限制日志数量
        if (this.logs.length > this.config.maxEntries) {
            this.logs = this.logs.slice(-this.config.maxEntries);
        }

        // 控制台输出
        this.consoleLog(entry);

        // 通知监听器
        this.notifyListeners(entry);

        // 发送到服务器
        if (this.config.sendToServer) {
            this.sendToServer(entry);
        }

        // 发送到 Sentry（仅错误和警告）
        if (level === LogLevel.ERROR || level === LogLevel.WARN) {
            this.sendToSentry(entry, error);
        }
    }

    /**
     * 控制台输出
     */
    private consoleLog(entry: LogEntry) {
        const prefix = `[${entry.level.toUpperCase()}] [${entry.category}]`;
        const message = `${prefix} ${entry.message}`;

        switch (entry.level) {
            case LogLevel.DEBUG:
                console.debug(message, entry.data);
                break;
            case LogLevel.INFO:
                console.info(message, entry.data);
                break;
            case LogLevel.WARN:
                console.warn(message, entry.data);
                break;
            case LogLevel.ERROR:
                console.error(message, entry.data, entry.stack);
                break;
        }
    }

    /**
     * 发送到服务器
     */
    private async sendToServer(entry: LogEntry) {
        if (!this.config.serverEndpoint) {
            return;
        }

        try {
            await fetch(this.config.serverEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
            });
        } catch (error) {
            console.error('发送日志到服务器失败:', error);
        }
    }

    /**
     * 发送到 Sentry
     */
    private sendToSentry(entry: LogEntry, error?: Error) {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }

        if (error) {
            captureError(error, {
                category: entry.category,
                ...entry.data
            });
        } else {
            captureMessage(entry.message, entry.level === LogLevel.ERROR ? 'error' : 'warning');
        }
    }

    /**
     * 通知监听器
     */
    private notifyListeners(entry: LogEntry) {
        this.listeners.forEach((listener) => {
            try {
                listener(entry);
            } catch (error) {
                console.error('日志监听器执行失败:', error);
            }
        });
    }

    /**
     * Debug 日志
     */
    debug(category: string, message: string, data?: any) {
        this.log(LogLevel.DEBUG, category, message, data);
    }

    /**
     * Info 日志
     */
    info(category: string, message: string, data?: any) {
        this.log(LogLevel.INFO, category, message, data);
    }

    /**
     * Warning 日志
     */
    warn(category: string, message: string, data?: any) {
        this.log(LogLevel.WARN, category, message, data);
    }

    /**
     * Error 日志
     */
    error(category: string, message: string, error?: Error, data?: any) {
        this.log(LogLevel.ERROR, category, message, data, error);
    }

    /**
     * 添加监听器
     */
    addListener(listener: (log: LogEntry) => void) {
        this.listeners.push(listener);
    }

    /**
     * 移除监听器
     */
    removeListener(listener: (log: LogEntry) => void) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    /**
     * 获取所有日志
     */
    getLogs(filter?: { level?: LogLevel; category?: string; limit?: number }): LogEntry[] {
        let logs = [...this.logs];

        if (filter?.level) {
            logs = logs.filter((log) => log.level === filter.level);
        }

        if (filter?.category) {
            logs = logs.filter((log) => log.category === filter.category);
        }

        if (filter?.limit) {
            logs = logs.slice(-filter.limit);
        }

        return logs;
    }

    /**
     * 清除日志
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * 导出日志
     */
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * 下载日志
     */
    downloadLogs() {
        const data = this.exportLogs();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 导出单例
export const logger = new Logger();

// 导出便捷函数
export const debug = (category: string, message: string, data?: any) => {
    logger.debug(category, message, data);
};

export const info = (category: string, message: string, data?: any) => {
    logger.info(category, message, data);
};

export const warn = (category: string, message: string, data?: any) => {
    logger.warn(category, message, data);
};

export const error = (category: string, message: string, err?: Error, data?: any) => {
    logger.error(category, message, err, data);
};

// 使用示例：
// import { logger, info, error } from './utils/logging';
//
// info('user', '用户登录', { userId: 123 });
// error('api', 'API 请求失败', new Error('Network error'), { endpoint: '/api/users' });
