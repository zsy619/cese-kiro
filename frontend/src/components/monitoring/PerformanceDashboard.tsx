import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import {
    DashboardOutlined,
    ThunderboltOutlined,
    ClockCircleOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { getMemoryUsage, getNetworkStatus } from '../../utils/performance';

interface PerformanceMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    threshold: { good: number; poor: number };
}

// 根据值计算评级
const calculateRating = (
    value: number,
    threshold: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
};

/**
 * 性能监控仪表板组件
 */
const PerformanceDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
    const [memory, setMemory] = useState<ReturnType<typeof getMemoryUsage>>(null);
    const [network, setNetwork] = useState<ReturnType<typeof getNetworkStatus>>(
        getNetworkStatus()
    );

    useEffect(() => {
        // 获取 Web Vitals 指标
        loadWebVitals();

        // 更新内存使用情况
        const memoryInterval = setInterval(() => {
            setMemory(getMemoryUsage());
        }, 5000);

        // 监听网络状态变化
        const updateNetwork = () => setNetwork(getNetworkStatus());
        window.addEventListener('online', updateNetwork);
        window.addEventListener('offline', updateNetwork);

        return () => {
            clearInterval(memoryInterval);
            window.removeEventListener('online', updateNetwork);
            window.removeEventListener('offline', updateNetwork);
        };
    }, []);

    const loadWebVitals = async () => {
        try {
            const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

            const metricsData: PerformanceMetric[] = [];

            getCLS((metric) => {
                const threshold = { good: 0.1, poor: 0.25 };
                metricsData.push({
                    name: 'CLS (累积布局偏移)',
                    value: metric.value,
                    rating: calculateRating(metric.value, threshold),
                    threshold
                });
                setMetrics([...metricsData]);
            });

            getFID((metric) => {
                const threshold = { good: 100, poor: 300 };
                metricsData.push({
                    name: 'FID (首次输入延迟)',
                    value: metric.value,
                    rating: calculateRating(metric.value, threshold),
                    threshold
                });
                setMetrics([...metricsData]);
            });

            getFCP((metric) => {
                const threshold = { good: 1800, poor: 3000 };
                metricsData.push({
                    name: 'FCP (首次内容绘制)',
                    value: metric.value,
                    rating: calculateRating(metric.value, threshold),
                    threshold
                });
                setMetrics([...metricsData]);
            });

            getLCP((metric) => {
                const threshold = { good: 2500, poor: 4000 };
                metricsData.push({
                    name: 'LCP (最大内容绘制)',
                    value: metric.value,
                    rating: calculateRating(metric.value, threshold),
                    threshold
                });
                setMetrics([...metricsData]);
            });

            getTTFB((metric) => {
                const threshold = { good: 800, poor: 1800 };
                metricsData.push({
                    name: 'TTFB (首字节时间)',
                    value: metric.value,
                    rating: calculateRating(metric.value, threshold),
                    threshold
                });
                setMetrics([...metricsData]);
            });
        } catch (error) {
            console.error('加载 Web Vitals 失败:', error);
        }
    };

    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'good':
                return 'success';
            case 'needs-improvement':
                return 'warning';
            case 'poor':
                return 'error';
            default:
                return 'default';
        }
    };

    const getRatingText = (rating: string) => {
        switch (rating) {
            case 'good':
                return '优秀';
            case 'needs-improvement':
                return '需改进';
            case 'poor':
                return '较差';
            default:
                return '未知';
        }
    };

    const columns = [
        {
            title: '指标',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '当前值',
            dataIndex: 'value',
            key: 'value',
            render: (value: number, record: PerformanceMetric) => {
                const unit = record.name.includes('CLS') ? '' : 'ms';
                return `${value.toFixed(2)}${unit}`;
            }
        },
        {
            title: '评级',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: string) => (
                <Tag color={getRatingColor(rating)}>{getRatingText(rating)}</Tag>
            )
        },
        {
            title: '阈值',
            key: 'threshold',
            render: (_: any, record: PerformanceMetric) => {
                const unit = record.name.includes('CLS') ? '' : 'ms';
                return `优秀: <${record.threshold.good}${unit} | 较差: >${record.threshold.poor}${unit}`;
            }
        }
    ];

    return (
        <div className='p-6'>
            <h2 className='text-2xl font-bold mb-6 flex items-center'>
                <DashboardOutlined className='mr-2' />
                性能监控仪表板
            </h2>

            {/* 概览卡片 */}
            <Row gutter={[16, 16]} className='mb-6'>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='网络状态'
                            value={network.online ? '在线' : '离线'}
                            prefix={<ThunderboltOutlined />}
                            valueStyle={{ color: network.online ? '#3f8600' : '#cf1322' }}
                        />
                        {network.effectiveType && (
                            <div className='mt-2 text-sm text-gray-500'>
                                网络类型: {network.effectiveType}
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='内存使用'
                            value={
                                memory
                                    ? ((memory.usedJSHeapSize! / memory.jsHeapSizeLimit!) * 100).toFixed(
                                        1
                                    )
                                    : 0
                            }
                            suffix='%'
                            prefix={<ClockCircleOutlined />}
                        />
                        {memory && (
                            <Progress
                                percent={Number(
                                    ((memory.usedJSHeapSize! / memory.jsHeapSizeLimit!) * 100).toFixed(1)
                                )}
                                showInfo={false}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068'
                                }}
                            />
                        )}
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='性能评分'
                            value={
                                metrics.length > 0
                                    ? (
                                        (metrics.filter((m) => m.rating === 'good').length /
                                            metrics.length) *
                                        100
                                    ).toFixed(0)
                                    : 0
                            }
                            suffix='分'
                            prefix={<DashboardOutlined />}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title='需改进项'
                            value={metrics.filter((m) => m.rating !== 'good').length}
                            prefix={<WarningOutlined />}
                            valueStyle={{
                                color:
                                    metrics.filter((m) => m.rating !== 'good').length > 0
                                        ? '#faad14'
                                        : '#3f8600'
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Web Vitals 详细指标 */}
            <Card title='Web Vitals 核心指标' className='mb-6'>
                <Table
                    dataSource={metrics}
                    columns={columns}
                    rowKey='name'
                    pagination={false}
                    loading={metrics.length === 0}
                />
            </Card>

            {/* 内存详情 */}
            {memory && (
                <Card title='内存使用详情'>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Statistic
                                title='已使用内存'
                                value={(memory.usedJSHeapSize! / 1024 / 1024).toFixed(2)}
                                suffix='MB'
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <Statistic
                                title='总内存'
                                value={(memory.totalJSHeapSize! / 1024 / 1024).toFixed(2)}
                                suffix='MB'
                            />
                        </Col>
                        <Col xs={24} md={8}>
                            <Statistic
                                title='内存限制'
                                value={(memory.jsHeapSizeLimit! / 1024 / 1024).toFixed(2)}
                                suffix='MB'
                            />
                        </Col>
                    </Row>
                </Card>
            )}
        </div>
    );
};

export default PerformanceDashboard;
