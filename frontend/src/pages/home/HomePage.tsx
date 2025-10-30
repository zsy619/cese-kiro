import React from 'react';
import { Row, Col, Typography, Space, Statistic } from 'antd';
import {
    RocketOutlined,
    FileTextOutlined,
    BulbOutlined,
    CloudDownloadOutlined,
    UserOutlined,
    FolderOutlined,
    HeartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/common';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    // 六要素说明数据
    const sixElements = [
        {
            title: '任务目标',
            description: '明确要完成的具体任务',
            icon: <RocketOutlined className='text-2xl text-blue-500' />
        },
        {
            title: 'AI的角色',
            description: '定义 AI 扮演的专业角色',
            icon: <BulbOutlined className='text-2xl text-green-500' />
        },
        {
            title: '我的角色',
            description: '说明用户的身份和立场',
            icon: <UserOutlined className='text-2xl text-purple-500' />
        },
        {
            title: '关键信息',
            description: '提供任务相关的核心信息和约束条件',
            icon: <FileTextOutlined className='text-2xl text-orange-500' />
        },
        {
            title: '行为规则',
            description: '规定 AI 的行为准则和输出要求',
            icon: <HeartOutlined className='text-2xl text-red-500' />
        },
        {
            title: '交付格式',
            description: '明确最终输出的格式和结构',
            icon: <CloudDownloadOutlined className='text-2xl text-cyan-500' />
        }
    ];

    // 功能特点数据
    const features = [
        {
            title: '智能提示词生成',
            description: '基于六要素结构，自动生成专业、精准的提示词模板',
            icon: <BulbOutlined />
        },
        {
            title: '主题管理系统',
            description: '支持创建、保存、编辑和管理多个提示词主题，方便复用和迭代',
            icon: <FolderOutlined />
        },
        {
            title: 'AI 辅助功能',
            description: '集成本地大模型，提供智能优化建议和内容补全',
            icon: <RocketOutlined />
        },
        {
            title: '多格式导出',
            description: '支持 Markdown 和 JSON 格式的模板导入导出，便于分享和协作',
            icon: <CloudDownloadOutlined />
        }
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            {/* 英雄区域 */}
            <div className='relative overflow-hidden bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
                    <div className='text-center'>
                        <Title level={1} className='!text-4xl md:!text-6xl !font-bold !text-gray-900 !mb-6'>
                            上下文工程六要素
                        </Title>
                        <Title level={2} className='!text-xl md:!text-2xl !text-gray-600 !font-normal !mb-8'>
                            让 AI 提示词生成更简单、更专业、更高效
                        </Title>
                        <Paragraph className='text-lg text-gray-600 max-w-3xl mx-auto mb-10'>
                            基于上下文工程理论，通过六个核心要素的结构化输入，
                            帮助您快速构建高质量的 AI 提示词模板。
                        </Paragraph>
                        <Space size='large'>
                            <Button
                                variant='primary'
                                size='large'
                                icon={<RocketOutlined />}
                                onClick={() => navigate('/generator')}
                                className='h-12 px-8 text-lg'
                            >
                                立即体验
                            </Button>
                            <Button
                                variant='secondary'
                                size='large'
                                onClick={() => navigate('/templates')}
                                className='h-12 px-8 text-lg'
                            >
                                查看模板
                            </Button>
                        </Space>
                    </div>
                </div>
            </div>

            {/* 六要素说明区域 */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                <div className='text-center mb-16'>
                    <Title level={2} className='!text-3xl !font-bold !text-gray-900 !mb-4'>
                        六要素框架
                    </Title>
                    <Paragraph className='text-lg text-gray-600 max-w-2xl mx-auto'>
                        系统化的提示词构建方法，确保每个提示词都包含完整的上下文信息
                    </Paragraph>
                </div>

                <Row gutter={[24, 24]}>
                    {sixElements.map((element, index) => (
                        <Col xs={24} sm={12} lg={8} key={index}>
                            <Card
                                cardVariant='shadow'
                                hoverable
                                className='h-full text-center border-0 bg-white/80 backdrop-blur-sm'
                            >
                                <div className='mb-4'>
                                    {element.icon}
                                </div>
                                <Title level={4} className='!mb-3 !text-gray-900'>
                                    {element.title}
                                </Title>
                                <Paragraph className='text-gray-600 !mb-0'>
                                    {element.description}
                                </Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* 功能特点区域 */}
            <div className='bg-white py-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <Title level={2} className='!text-3xl !font-bold !text-gray-900 !mb-4'>
                            核心功能
                        </Title>
                        <Paragraph className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            强大的功能集合，让提示词创建和管理变得简单高效
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]}>
                        {features.map((feature, index) => (
                            <Col xs={24} md={12} key={index}>
                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                                        <span className='text-blue-600 text-xl'>
                                            {feature.icon}
                                        </span>
                                    </div>
                                    <div className='flex-1'>
                                        <Title level={4} className='!mb-2 !text-gray-900'>
                                            {feature.title}
                                        </Title>
                                        <Paragraph className='text-gray-600 !mb-0'>
                                            {feature.description}
                                        </Paragraph>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* 统计数据区域 */}
            <div className='bg-gradient-to-r from-blue-600 to-indigo-600 py-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <Row gutter={[32, 32]} className='text-center'>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={<span className='text-blue-100'>用户数量</span>}
                                value={1234}
                                valueStyle={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 'bold' }}
                                suffix={<span className='text-blue-100'>+</span>}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={<span className='text-blue-100'>生成模板数</span>}
                                value={5678}
                                valueStyle={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 'bold' }}
                                suffix={<span className='text-blue-100'>+</span>}
                            />
                        </Col>
                        <Col xs={24} sm={8}>
                            <Statistic
                                title={<span className='text-blue-100'>活跃用户数</span>}
                                value={890}
                                valueStyle={{ color: '#ffffff', fontSize: '2.5rem', fontWeight: 'bold' }}
                                suffix={<span className='text-blue-100'>+</span>}
                            />
                        </Col>
                    </Row>
                </div>
            </div>

            {/* CTA 区域 */}
            <div className='bg-gray-50 py-20'>
                <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
                    <Title level={2} className='!text-3xl !font-bold !text-gray-900 !mb-6'>
                        开始创建您的第一个提示词模板
                    </Title>
                    <Paragraph className='text-lg text-gray-600 mb-10'>
                        只需几分钟，就能创建出专业的 AI 提示词模板
                    </Paragraph>
                    <Button
                        variant='primary'
                        size='large'
                        icon={<RocketOutlined />}
                        onClick={() => navigate('/generator')}
                        className='h-14 px-12 text-lg'
                    >
                        立即开始
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
