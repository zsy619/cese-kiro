/**
 * 告警系统
 * 监控应用性能和错误，触发告警
 */

import { captureMessage, captureError } from '../config/sentry';

export interface AlertRule {
    id: string;
    name: string;
    type: 'performance' | 'error' | 'custom';
    condition: (value: any) => boolean;
    threshold: number;
    enabled: boolean;
    cooldown: number; // 冷却时间（毫秒）
    lastTriggered?: number;
}

export interface Alert {
    id: string;
    ruleId: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: number;
    data?: any;
}

class AlertingSystem {
    private rules: Map<string, AlertRule> = new Map();
    private alerts: Alert[] = [];
    private listeners: Array<(alert: Alert) => void> = [];

    constructor() {
        this.initializeDefaultRules();
        this.startMonitoring();
    }

    /**
     * 初始化默认告警规则
     */
    private initializeDefaultRules() {
        // LCP 告警
        this.addRule({
            id: 'lcp-slow',
            name: 'LCP 过慢',
            type: 'performance',
            condition: (value: number) => value > 4000,
            threshold: 4000,
            enabled: true,
            cooldown: 60000 // 1分钟
        });

        // FID 告警
        this.addRule({
            id: 'fid-slow',
            name: 'FID 过慢',
            type: 'performance',
            condition: (value: number) => value > 300,
            threshold: 300,
            enabled: true,
            cooldown: 60000
        });

        // CLS 告警
        this.addRule({
            id: 'cls-high',
            name: 'CLS 过高',
            type: 'performance',
            condition: (value: number) => value > 0.25,
            threshold: 0.25,
            enabled: true,
            cooldown: 60000
        });

        // 内存使用告警
        this.addRule({
            id: 'memory-high',
            name: '内存使用过高',
            type: 'performance',
            condition: (usage: number) => usage > 80,
            threshold: 80,
            enabled: true,
            cooldown: 300000 // 5分钟
        });

        // 错误率告警
        this.addRule({
            id: 'error-rate-high',
            name: '错误率过高',
            type: 'error',
            condition: (rate: number) => rate > 5,
            threshold: 5,
            enabled: true,
            cooldown: 300000
        });
    }

    /**
     * 开始监控
     */
    private startMonitoring() {
        // 监控 Web Vitals
        this.monitorWebVitals();

        // 监控内存使用
        this.monitorMemory();

        // 监控错误
        this.monitorErrors();
    }

    /**
     * 监控 Web Vitals
     */
    private async monitorWebVitals() {
        try {
            const { getCLS, getFID, getLCP } = await import('web-vitals');

            getCLS((metric) => {
                this.checkRule('cls-high', metric.value, {
                    name: 'CLS',
                    value: metric.value,
                    id: metric.id
                });
            });

            getFID((metric) => {
                this.checkRule('fid-slow', metric.value, {
                    name: 'FID',
                    value: metric.value,
                    id: metric.id
                });
            });

            getLCP((metric) => {
                this.checkRule('lcp-slow', metric.value, {
                    name: 'LCP',
                    value: metric.value,
                    id: metric.id
                });
            });
        } catch (error) {
            console.error('监控 Web Vitals 失败:', error);
        }
    }

    /**
     * 监控内存使用
     */
    private monitorMemory() {
        setInterval(() => {
            const memory = (performance as any).memory;
            if (memory) {
                const usage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
                this.checkRule('memory-high', usage, {
                    used: memory.usedJSHeapSize,
                    total: memory.jsHeapSizeLimit,
                    usage: usage.toFixed(2) + '%'
                });
            }
        }, 30000); // 每30秒检查一次
    }

    /**
     * 监控错误
     */
    private monitorErrors() {
        let errorCount = 0;
        let lastCheck = Date.now();

        window.addEventListener('error', () => {
            errorCount++;

            // 每分钟计算一次错误率
            const now = Date.now();
            if (now - lastCheck > 60000) {
                const errorRate = errorCount;
                this.checkRule('error-rate-high', errorRate, {
                    count: errorCount,
                    period: '1分钟'
                });

                errorCount = 0;
                lastCheck = now;
            }
        });
    }

    /**
     * 添加告警规则
     */
    addRule(rule: AlertRule) {
        this.rules.set(rule.id, rule);
    }

    /**
     * 移除告警规则
     */
    removeRule(ruleId: string) {
        this.rules.delete(ruleId);
    }

    /**
     * 启用/禁用规则
     */
    toggleRule(ruleId: string, enabled: boolean) {
        const rule = this.rules.get(ruleId);
        if (rule) {
            rule.enabled = enabled;
        }
    }

    /**
     * 检查规则
     */
    private checkRule(ruleId: string, value: any, data?: any) {
        const rule = this.rules.get(ruleId);
        if (!rule || !rule.enabled) {
            return;
        }

        // 检查冷却时间
        if (rule.lastTriggered && Date.now() - rule.lastTriggered < rule.cooldown) {
            return;
        }

        // 检查条件
        if (rule.condition(value)) {
            this.triggerAlert(rule, value, data);
        }
    }

    /**
     * 触发告警
     */
    private triggerAlert(rule: AlertRule, value: any, data?: any) {
        const alert: Alert = {
            id: `alert-${Date.now()}-${Math.random()}`,
            ruleId: rule.id,
            level: this.getAlertLevel(rule, value),
            message: `${rule.name}: 当前值 ${value} 超过阈值 ${rule.threshold}`,
            timestamp: Date.now(),
            data
        };

        // 更新规则触发时间
        rule.lastTriggered = Date.now();

        // 保存告警
        this.alerts.push(alert);

        // 限制告警历史数量
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(-100);
        }

        // 通知监听器
        this.notifyListeners(alert);

        // 发送到 Sentry
        this.sendToSentry(alert);

        // 控制台输出
        console.warn('[Alert]', alert.message, alert.data);
    }

    /**
     * 获取告警级别
     */
    private getAlertLevel(rule: AlertRule, value: any): Alert['level'] {
        const ratio = value / rule.threshold;

        if (ratio > 2) {
            return 'critical';
        } else if (ratio > 1.5) {
            return 'error';
        } else if (ratio > 1) {
            return 'warning';
        }
        return 'info';
    }

    /**
     * 发送到 Sentry
     */
    private sendToSentry(alert: Alert) {
        if (process.env.NODE_ENV === 'production') {
            const level = alert.level === 'critical' ? 'error' : alert.level;
            captureMessage(alert.message, level as any);
        }
    }

    /**
     * 添加监听器
     */
    addListener(listener: (alert: Alert) => void) {
        this.listeners.push(listener);
    }

    /**
     * 移除监听器
     */
    removeListener(listener: (alert: Alert) => void) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    /**
     * 通知所有监听器
     */
    private notifyListeners(alert: Alert) {
        this.listeners.forEach((listener) => {
            try {
                listener(alert);
            } catch (error) {
                console.error('告警监听器执行失败:', error);
            }
        });
    }

    /**
     * 获取所有告警
     */
    getAlerts(): Alert[] {
        return [...this.alerts];
    }

    /**
     * 获取所有规则
     */
    getRules(): AlertRule[] {
        return Array.from(this.rules.values());
    }

    /**
     * 清除告警历史
     */
    clearAlerts() {
        this.alerts = [];
    }
}

// 导出单例
export const alertingSystem = new AlertingSystem();

// 导出便捷函数
export const addAlertListener = (listener: (alert: Alert) => void) => {
    alertingSystem.addListener(listener);
};

export const removeAlertListener = (listener: (alert: Alert) => void) => {
    alertingSystem.removeListener(listener);
};

export const getAlerts = () => alertingSystem.getAlerts();

export const getRules = () => alertingSystem.getRules();
