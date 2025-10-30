import React, { useState } from 'react';
import { Layout, Button, Dropdown, Space, Drawer, Menu } from 'antd';
import { UserOutlined, MenuOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import AuthModal from '../auth/AuthModal';
import type { MenuItem } from '../../types';

const { Header, Content, Footer } = Layout;

export interface SeceLayoutProps {
    children: React.ReactNode;
}

/**
 * SECE 风格布局组件 - 优化版
 * 更加协调美观的设计
 */
const SeceLayout: React.FC<SeceLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, logout } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

    // 导航菜单项
    const menuItems: MenuItem[] = [
        { key: 'home', label: '首页', path: '/' },
        { key: 'generator', label: '提示词生成', path: '/generator' },
        { key: 'templates', label: '模板库', path: '/templates' },
        { key: 'config', label: 'API配置', path: '/config' }
    ];

    // 用户菜单
    const userMenuItems = [
        {
            key: 'profile',
            label: '个人中心',
            icon: <UserOutlined />
        },
        {
            key: 'settings',
            label: '设置',
            icon: <SettingOutlined />
        },
        {
            type: 'divider' as const
        },
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            onClick: () => {
                logout();
                navigate('/');
            }
        }
    ];

    return (
        <Layout className='min-h-screen bg-white'>
            {/* 顶部导航栏 - B018 规格 */}
            <Header className='fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 px-0 h-16 leading-[64px]'>
                <div className='w-full min-w-[1024px] max-w-[1400px] mx-auto px-8 h-full flex items-center justify-between'>
                    {/* Logo - 渐变图标 + 文字 */}
                    <div
                        className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => navigate('/')}
                    >
                        {/* 渐变方形图标 */}
                        <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                            <span className='text-white text-sm font-bold'>C</span>
                        </div>
                        {/* 渐变文字 */}
                        <span className='text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                            CESE
                        </span>
                    </div>

                    {/* 桌面端导航 - B018 规格 */}
                    <nav className='hidden md:flex items-center space-x-2'>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => navigate(item.path!)}
                                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isActive
                                        ? 'text-blue-600 bg-blue-50 font-medium'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* 右侧操作区 */}
                    <div className='flex items-center space-x-2'>
                        {state.isAuthenticated ? (
                            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
                                <div className='flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors px-3 py-2 rounded-md'>
                                    <UserOutlined className='text-base' />
                                    <span className='text-sm hidden sm:inline font-medium'>
                                        {state.user?.nickname || '用户'}
                                    </span>
                                </div>
                            </Dropdown>
                        ) : (
                            <Space size={8}>
                                <Button
                                    type='text'
                                    onClick={() => {
                                        setAuthModalTab('login');
                                        setAuthModalVisible(true);
                                    }}
                                    className='text-gray-700 hover:bg-gray-50 font-medium h-9 px-4'
                                >
                                    登录
                                </Button>
                                <button
                                    onClick={() => {
                                        setAuthModalTab('register');
                                        setAuthModalVisible(true);
                                    }}
                                    className='h-9 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-shadow duration-200 shadow-sm'
                                >
                                    注册
                                </button>
                            </Space>
                        )}

                        {/* 移动端菜单按钮 */}
                        <Button
                            type='text'
                            icon={<MenuOutlined />}
                            onClick={() => setMobileMenuOpen(true)}
                            className='md:hidden text-gray-600'
                        />
                    </div>
                </div>
            </Header>

            {/* 移动端抽屉菜单 */}
            <Drawer
                title='菜单'
                placement='right'
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
            >
                <Menu
                    mode='vertical'
                    selectedKeys={[
                        menuItems.find((item) => item.path === location.pathname)?.key || ''
                    ]}
                    onClick={({ key }) => {
                        const item = menuItems.find((item) => item.key === key);
                        if (item?.path) {
                            navigate(item.path);
                            setMobileMenuOpen(false);
                        }
                    }}
                    items={menuItems.map((item) => ({
                        key: item.key,
                        label: item.label
                    }))}
                    className='border-none'
                />
            </Drawer>

            {/* 主内容区域 */}
            <Content className='mt-16'>
                {children}
            </Content>

            {/* 底部 - SmartSchool 风格 */}
            <Footer className='bg-white border-t border-gray-200 py-12'>
                <div className='w-full min-w-[1024px] max-w-[1100px] mx-auto px-8'>
                    {/* 简化的底部内容 - 居中布局 */}
                    <div className='flex flex-col items-center gap-6 text-center'>
                        {/* 品牌信息 */}
                        <div className='flex flex-col items-center gap-2'>
                            <span className='text-lg font-bold text-gray-900'>CESE</span>
                            <p className='text-sm text-gray-500'>
                                基于上下文工程六要素理论的 AI 提示词生成工具
                            </p>
                        </div>
                        {/* 导航链接 */}
                        <div className='flex items-center gap-6'>
                            <a href='/generator' className='text-sm text-gray-600 hover:text-gray-900 transition-colors'>
                                提示词生成
                            </a>
                            <span className='text-gray-300'>·</span>
                            <a href='/templates' className='text-sm text-gray-600 hover:text-gray-900 transition-colors'>
                                模板库
                            </a>
                            <span className='text-gray-300'>·</span>
                            <a
                                href='https://github.com/zsy619/cese-kiro'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-sm text-gray-600 hover:text-gray-900 transition-colors'
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                    {/* 版权信息 */}
                    <div className='mt-8 pt-6 border-t border-gray-200 text-center'>
                        <p className='text-xs text-gray-400'>
                            © 2024 CESE. All rights reserved.
                        </p>
                    </div>
                </div>
            </Footer>

            {/* 认证弹窗 */}
            <AuthModal
                visible={authModalVisible}
                onClose={() => setAuthModalVisible(false)}
                defaultTab={authModalTab}
            />
        </Layout>
    );
};

export default SeceLayout;
