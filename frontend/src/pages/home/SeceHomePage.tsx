import React from 'react';
import { Card, Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * SECE 风格首页 - 优化版
 * 更加协调美观的设计
 */
const SeceHomePage: React.FC = () => {

    // 核心功能
    const features = [
        { title: '六要素制定器', desc: '从任意要素开始填写，灵活定义AI交互的完整上下文', icon: '📝' },
        { title: '模板库管理', desc: '保存和管理您的提示词模板，随时复用和优化', icon: '📚' },
        { title: '多模式输出', desc: '支持Markdown、JSON、TXT等多种格式导出', icon: '📄' },
        { title: '历史版本', desc: '实时记录每次编辑的历史版本，随时回溯', icon: '🔍' },
        { title: '案例搜索', desc: '查找适合您场景的提示词案例和最佳实践', icon: '🔎' },
        { title: 'AI辅助生成', desc: '基于AI能力自动补全和优化您的提示词', icon: '🤖' }
    ];

    // 核心优势
    const advantages = [
        {
            icon: '💡',
            title: '可复用',
            desc: '一键生成提示词模板，不需要每次从头开始'
        },
        {
            icon: '📋',
            title: '可复制',
            desc: '轻松复制提示词内容，快速应用到AI工具中'
        },
        {
            icon: '🎯',
            title: '精准实用',
            desc: '六要素框架确保提示词完整性和有效性'
        }
    ];

    return (
        <div className='bg-white'>
            {/* Hero Section - B018 SmartSchool 风格 */}
            <section className='relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden'>
                {/* 装饰性背景元素 */}
                <div className='absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob'></div>
                <div className='absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
                <div className='absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000'></div>

                <div className='relative w-full min-w-[1024px] max-w-[1400px] mx-auto px-8'>
                    <div className='text-center'>
                        {/* 顶部标签 */}
                        <div className='inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-6'>
                            <span className='text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                ✨ 基于六要素理论的 AI 提示词工具
                            </span>
                        </div>

                        {/* 主标题 - 双色渐变 */}
                        <Title level={1} className='!text-5xl md:!text-6xl !font-bold !mb-6 !leading-tight'>
                            <span className='bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent'>
                                上下文工程
                            </span>
                            <br />
                            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                六要素工具
                            </span>
                        </Title>

                        {/* 副标题 */}
                        <Paragraph className='!text-base !text-gray-600 !mb-10 !leading-relaxed max-w-4xl mx-auto'>
                            基于上下文工程六要素理论，帮助您快速构建高质量的 AI 提示词模板。
                            从任务目标到交付格式，全方位指导您的 AI 交互设计。
                        </Paragraph>

                        {/* CTA 按钮组 */}
                        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-16'>
                            <button
                                onClick={() => window.location.href = '/generator'}
                                className='h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base font-medium rounded-lg hover:shadow-xl transition-shadow duration-200 shadow-lg'
                            >
                                开始使用
                            </button>
                            <button
                                onClick={() => window.location.href = '/templates'}
                                className='h-12 px-8 bg-white text-gray-700 text-base font-medium rounded-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors duration-200'
                            >
                                浏览模板
                            </button>
                        </div>

                        {/* 统计数据 */}
                        <div className='grid grid-cols-3 gap-8 max-w-2xl mx-auto'>
                            <div>
                                <div className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                                    1000+
                                </div>
                                <div className='text-sm text-gray-600'>活跃用户</div>
                            </div>
                            <div>
                                <div className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                                    5000+
                                </div>
                                <div className='text-sm text-gray-600'>提示词模板</div>
                            </div>
                            <div>
                                <div className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                                    98%
                                </div>
                                <div className='text-sm text-gray-600'>满意度</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 核心功能 - B017+B018 规格 */}
            <section className='py-16 bg-white'>
                <div className='w-full min-w-[1024px] max-w-[1400px] mx-auto px-8'>
                    {/* Section 标题 */}
                    <div className='text-center mb-14'>
                        {/* 标签 */}
                        <div className='inline-flex items-center px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4'>
                            核心功能
                        </div>
                        {/* 主标题 */}
                        <Title level={2} className='!text-4xl !font-bold !mb-3'>
                            <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                                六大核心功能
                            </span>
                        </Title>
                        {/* 副标题 */}
                        <Paragraph className='!text-lg !text-gray-600 !mb-0 max-w-2xl mx-auto'>
                            助力您高效创建专业的 AI 提示词
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]} justify='center'>
                        {features.map((feature, index) => (
                            <Col xs={24} sm={12} lg={8} key={index}>
                                <div className='group h-full p-8 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 rounded-2xl'>
                                    {/* 图标容器 - 渐变背景 */}
                                    <div className='w-16 h-16 mb-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                                        <span className='text-6xl'>{feature.icon}</span>
                                    </div>
                                    {/* 标题 */}
                                    <Title level={4} className='!mb-3 !text-gray-900 !text-xl !font-semibold'>
                                        {feature.title}
                                    </Title>
                                    {/* 描述 */}
                                    <Paragraph className='!text-gray-600 !mb-0 !text-base !leading-relaxed'>
                                        {feature.desc}
                                    </Paragraph>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </section>

            {/* 核心优势 - B018 规格 */}
            <section className='py-16 bg-gradient-to-br from-gray-50 to-blue-50'>
                <div className='w-full min-w-[1024px] max-w-[1400px] mx-auto px-8'>
                    <div className='text-center'>
                        {/* 标签 */}
                        <div className='inline-flex items-center px-4 py-1 bg-white text-blue-600 rounded-full text-sm font-medium mb-4'>
                            核心优势
                        </div>
                        {/* 主标题 */}
                        <Title level={2} className='!text-4xl !font-bold !mb-3'>
                            <span className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent'>
                                为什么选择 CESE
                            </span>
                        </Title>
                        {/* 副标题 */}
                        <Paragraph className='!text-lg !text-gray-600 !mb-14 max-w-2xl mx-auto'>
                            三大核心优势，让提示词创建更简单高效
                        </Paragraph>

                        <Row gutter={[48, 32]} justify='center'>
                            {advantages.map((item, index) => (
                                <Col xs={24} md={8} key={index}>
                                    <div className='p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300'>
                                        {/* 图标容器 - 渐变背景 */}
                                        <div className='w-16 h-16 mb-5 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                                            <span className='text-6xl'>{item.icon}</span>
                                        </div>
                                        {/* 标题 */}
                                        <Title level={4} className='!mb-3 !text-gray-900 !text-xl !font-semibold text-center'>
                                            {item.title}
                                        </Title>
                                        {/* 描述 */}
                                        <Paragraph className='!text-gray-600 !mb-0 !text-base !leading-relaxed text-center'>
                                            {item.desc}
                                        </Paragraph>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </section>

            {/* CTA 区域 - B018 规格 */}
            <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600'>
                <div className='w-full min-w-[1024px] max-w-[1400px] mx-auto px-8 text-center'>
                    <Title level={2} className='!text-4xl !font-bold !mb-4 !text-white'>
                        准备好开始了吗？
                    </Title>
                    <Paragraph className='!text-xl !text-blue-100 !mb-10 max-w-2xl mx-auto'>
                        立即体验基于六要素理论的 AI 提示词生成工具
                    </Paragraph>
                    <button
                        onClick={() => window.location.href = '/generator'}
                        className='h-14 px-10 bg-white text-blue-600 text-lg font-bold rounded-lg hover:shadow-2xl transition-shadow duration-200 shadow-xl'
                    >
                        立即开始使用
                    </button>
                </div>
            </section>
        </div>
    );
};

export default SeceHomePage;
