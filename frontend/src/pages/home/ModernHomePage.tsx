import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import {
    RocketOutlined,
    FileTextOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

/**
 * 现代化首页
 * 参考 huanwang.org 的简洁设计
 */
const ModernHomePage: React.FC = () => {
    const navigate = useNavigate();

    // 六要素
    const elements = [
        { title: '任务目标', icon: '🎯', desc: '明确要完成的具体任务' },
        { title: 'AI的角色', icon: '🤖', desc: '定义 AI 扮演的专业角色' },
        { title: '我的角色', icon: '👤', desc: '说明用户的身份和立场' },
        { title: '关键信息', icon: '📋', desc: '提供任务相关的核心信息' },
        { title: '行为规则', icon: '📏', desc: '规定 AI 的行为准则' },
        { title: '交付格式', icon: '📦', desc: '明确最终输出的格式' }
    ];

    // 特性
    const features = [
        {
            icon: <ThunderboltOutlined className='text-3xl text-blue-500' />,
            title: '快速生成',
            desc: '基于六要素框架，快速生成专业提示词'
        },
        {
            icon: <FileTextOutlined className='text-3xl text-green-500' />,
            title: '模板管理',
            desc: '保存和管理您的提示词模板，随时复用'
        },
        {
            icon: <BulbOutlined className='text-3xl text-purple-500' />,
            title: 'AI 优化',
            desc: '智能优化建议，提升提示词质量'
        }
    ];

    return (
        <div className='bg-white'>
            {/* Hero Section */}
            <section className='relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
                    <div className='text-center'>
                        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>
                            上下文工程六要素
                        </h1>
                        <p className='text-xl md:text-2xl text-gray-600 mb-4'>
                            让 AI 提示词生成更简单、更专业
                        </p>
                        <p className='text-lg text-gray-500 mb-10 max-w-2xl mx-auto'>
                            基于上下文工程理论，通过六个核心要素的结构化输入，
                            帮助您快速构建高质量的 AI 提示词模板
                        </p>
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                            <Button
                                type='primary'
                                size='large'
                                icon={<RocketOutlined />}
                                onClick={() => navigate('/generator')}
                                className='h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:shadow-xl transition-all'
                            >
                                立即开始
                            </Button>
                            <Button
                                size='large'
                                onClick={() => navigate('/templates')}
                                className='h-12 px-8 text-base'
                            >
                                查看模板
                                <ArrowRightOutlined />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 装饰性背景 */}
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                    <div className='absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
                    <div className='absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
                    <div className='absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
                </div>
            </section>

            {/* 六要素介绍 */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            六要素框架
                        </h2>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            系统化的提示词构建方法，确保每个提示词都包含完整的上下文信息
                        </p>
                    </div>

                    <Row gutter={[24, 24]}>
                        {elements.map((element, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <Card
                                    bordered={false}
                                    className='h-full hover:shadow-lg transition-shadow bg-white'
                                >
                                    <div className='text-center'>
                                        <div className='text-5xl mb-4'>{element.icon}</div>
                                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                            {element.title}
                                        </h3>
                                        <p className='text-gray-600'>{element.desc}</p>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 核心特性 */}
            <section className='py-20 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            核心特性
                        </h2>
                        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                            强大的功能集合，让提示词创建和管理变得简单高效
                        </p>
                    </div>

                    <Row gutter={[48, 48]}>
                        {features.map((feature, index) => (
                            <Col xs={24} md={8} key={index}>
                                <div className='text-center'>
                                    <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6'>
                                        {feature.icon}
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-gray-600'>{feature.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 使用流程 */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                            简单三步，快速开始
                        </h2>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {[
                            { step: '1', title: '填写六要素', desc: '按照框架填写提示词的六个核心要素' },
                            { step: '2', title: '生成模板', desc: '系统自动生成结构化的提示词模板' },
                            { step: '3', title: '保存使用', desc: '保存模板到库中，随时复用和优化' }
                        ].map((item, index) => (
                            <div key={index} className='relative'>
                                <div className='bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow'>
                                    <div className='inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold rounded-xl mb-4'>
                                        {item.step}
                                    </div>
                                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                        {item.title}
                                    </h3>
                                    <p className='text-gray-600'>{item.desc}</p>
                                </div>
                                {index < 2 && (
                                    <div className='hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2'>
                                        <ArrowRightOutlined className='text-2xl text-gray-300' />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 bg-gradient-to-r from-blue-600 to-indigo-600'>
                <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
                    <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
                        准备好开始了吗？
                    </h2>
                    <p className='text-xl text-blue-100 mb-10'>
                        只需几分钟，就能创建出专业的 AI 提示词模板
                    </p>
                    <Button
                        type='primary'
                        size='large'
                        icon={<RocketOutlined />}
                        onClick={() => navigate('/generator')}
                        className='h-14 px-12 text-lg bg-white text-blue-600 border-none hover:shadow-2xl transition-all hover:scale-105'
                    >
                        立即开始
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default ModernHomePage;
