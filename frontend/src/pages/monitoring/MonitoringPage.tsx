import React, { useState, useEffect } from 'react';
import { Tabs, Card, Table, Tag, Button, Switch, Space, message } from 'antd';
import {
    DashboardOutlined,
    BellOutlined,
    FileTextOutlined,
    DownloadOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import PerformanceDashboard from '../../components/monitoring/PerformanceDashboard';
import { alertingSystem, Alert, AlertRule } from '../../utils/alerting';
import { logger, LogEntry, LogLevel } from '../../utils/logging';

const { TabPane } = Tabs;

/**
 * 监控管理页面
 */
const MonitoringPage: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [rules, setRules] = useState<AlertRule[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        // 加载告警和日志
        loadData();

        // 监听新告警
        const handleAlert = (alert: Alert) => {
            setAlerts((prev) => [alert, ...prev]);
            message.warning(`告警: ${alert.message}`);
        };

        alertingSystem.addListener(handleAlert);

        // 监听新日志
        const handleLog = (log: LogEntry) => {
            setLogs((prev) => [log, ...prev].slice(0, 100));
        };

        logger.addListener(handleLog);

        return () => {
            alertingSystem.removeListener(handleAlert);
            logger.removeListener(handleLog);
        };
    }, []);

    const loadData = () => {
        setAlerts(alertingSystem.getAlerts());
        setRules(alertingSystem.getRules());
        setLogs(logger.getLogs({ limit: 100 }));
    };

    const handleToggleRule = (ruleId: string, enabled: boolean) => {
        alertingSystem.toggleRule(ruleId, enabled);
        setRules(alertingSystem.getRules());
        message.success(enabled ? '规则已启用' : '规则已禁用');
    };

    const handleClearAlerts = () => {
        alertingSystem.clearAlerts();
        setAlerts([]);
        message.success('告警历史已清除');
    };

    const handleClearLogs = () => {
        logger.clearLogs();
        setLogs([]);
        message.success('日志已清除');
    };

    const handleDownloadLogs = () => {
        logger.downloadLogs();
        message.success('日志已下载');
    };

    // 告警表格列
    const alertColumns = [
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: number) => new Date(timestamp).toLocaleString()
        },
        {
            title: '级别',
            dataIndex: 'level',
            key: 'level',
            render: (level: string) => {
                const colors: Record<string, string> = {
                    info: 'blue',
                    warning: 'orange',
                    error: 'red',
                    critical: 'purple'
                };
                return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
            }
        },
        {
            title: '消息',
            dataIndex: 'message',
            key: 'message'
        }
    ];

    // 规则表格列
    const ruleColumns = [
        {
            title: '规则名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag>{type}</Tag>
        },
        {
            title: '阈值',
            dataIndex: 'threshold',
            key: 'threshold'
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (enabled: boolean, record: AlertRule) => (
                <Switch
                    checked={enabled}
                    onChange={(checked) => handleToggleRule(record.id, checked)}
                />
            )
        }
    ];

    // 日志表格列
    const logColumns = [
        {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 180,
            render: (timestamp: number) => new Date(timestamp).toLocaleString()
        },
        {
            title: '级别',
            dataIndex: 'level',
            key: 'level',
            width: 80,
            render: (level: LogLevel) => {
                const colors: Record<LogLevel, string> = {
                    [LogLevel.DEBUG]: 'default',
                    [LogLevel.INFO]: 'blue',
                    [LogLevel.WARN]: 'orange',
                    [LogLevel.ERROR]: 'red'
                };
                return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
            }
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 100
        },
        {
            title: '消息',
            dataIndex: 'message',
            key: 'message'
        }
    ];

    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold mb-6'>监控中心</h1>

            <Tabs defaultActiveKey='dashboard'>
                <TabPane
                    tab={
                        <span>
                            <DashboardOutlined />
                            性能仪表板
                        </span>
                    }
                    key='dashboard'
                >
                    <PerformanceDashboard />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <BellOutlined />
                            告警管理
                        </span>
                    }
                    key='alerts'
                >
                    <Card
                        title='告警规则'
                        extra={
                            <Button onClick={loadData} type='link'>
                                刷新
                            </Button>
                        }
                        className='mb-4'
                    >
                        <Table
                            dataSource={rules}
                            columns={ruleColumns}
                            rowKey='id'
                            pagination={false}
                        />
                    </Card>

                    <Card
                        title='告警历史'
                        extra={
                            <Space>
                                <Button onClick={loadData} type='link'>
                                    刷新
                                </Button>
                                <Button
                                    onClick={handleClearAlerts}
                                    icon={<DeleteOutlined />}
                                    danger
                                >
                                    清除
                                </Button>
                            </Space>
                        }
                    >
                        <Table
                            dataSource={alerts}
                            columns={alertColumns}
                            rowKey='id'
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <FileTextOutlined />
                            日志管理
                        </span>
                    }
                    key='logs'
                >
                    <Card
                        title='应用日志'
                        extra={
                            <Space>
                                <Button onClick={loadData} type='link'>
                                    刷新
                                </Button>
                                <Button
                                    onClick={handleDownloadLogs}
                                    icon={<DownloadOutlined />}
                                >
                                    下载
                                </Button>
                                <Button onClick={handleClearLogs} icon={<DeleteOutlined />} danger>
                                    清除
                                </Button>
                            </Space>
                        }
                    >
                        <Table
                            dataSource={logs}
                            columns={logColumns}
                            rowKey='id'
                            pagination={{ pageSize: 20 }}
                            scroll={{ x: 1000 }}
                        />
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default MonitoringPage;
