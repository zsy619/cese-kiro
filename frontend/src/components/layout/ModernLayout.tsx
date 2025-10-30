import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Drawer } from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    FolderOutlined,
    SettingOutlined,
    UserOutlined,
    LoginOutlined,
    MenuOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import AuthModal from '../auth/AuthModal';
import type { MenuItem } from '../../types';

const { Header, Content, Footer } = Layout;

export interface ModernLayoutProps {
    children: React.ReactNode;
}

/**
 * 现代化布局组件
 * 参考 huanwang.org 的简洁设计风格
 */
const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, logout } = useApp();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

    // 导航菜单项
    const menuItems: MenuItem[] = [
        {
            key: 'home',
            label: '首页',
            icon: <HomeOutlined />,
            path: '/'
        },
        {
            key: 'generator',
            label: '生成器',
            icon: <FileTextOutlined />,
            path: '/generator'
        },
        {
            key: 'templates',
            label: '模板库',
            icon: <FolderOutlined />,
            path: '/templates'
        },
        {
            key: 'config',
            label: '配置',
            icon: <SettingOutlined />,
            path: '/config'
        }
    ];

    // 获取当前选中的菜单
    const getSelectedKey = () => {
        const item = menuItems.find((item) => item.path === location.pathname);
        return item ? [item.key] : [];
    };

    // 处理菜单点击
    const handleMenuClick = ({ key }: { key: string }) => {
        const item = menuItems.find((item) => item.key === key);
        if (item?.path) {
            navigate(item.path);
            setMobileMenuOpen(false);
        }
    };

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
        <Layout className='min-h-screen bg-gray-50'>
            {/* 顶部导航栏 */}
            <Header className='fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-0 h-16 leading-16'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
                    {/* Logo */}
                    <div
                        className='flex items-center cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => navigate('/')}
                    >
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md'>
                            <span className='text-white font-bold text-xl'>C</span>
                        </div>
                        <span className='text-xl font-semibold text-gray-900 hidden sm:inline'>
                            CESE
                        </span>
                    </div>

                    {/* 桌面端导航 */}
                    <nav className='hidden md:flex items-center space-x-1'>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => navigate(item.path!)}
                                    className={`
										px-4 py-2 rounded-lg text-sm font-medium transition-all
										${isActive
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }
									`}
                                >
                                    <span className='mr-2'>{item.icon}</span>
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* 右侧操作区 */}
                    <div className='flex items-center space-x-3'>
                        {state.isAuthenticated ? (
                            <Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
                                <div className='flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity'>
                                    <Avatar
                                        size={36}
                                        icon={<UserOutlined />}
                                        src={state.user?.avatar}
                                        className='bg-gradient-to-br from-blue-500 to-indigo-600'
                                    />
                                    <span className='hidden sm:inline text-sm font-medium text-gray-700'>
                                        {state.user?.nickname || '用户'}
                                    </span>
                                </div>
                            </Dropdown>
                        ) : (
                            <Space size='small'>
                                <Button
                                    type='text'
                                    onClick={() => {
                                        setAuthModalTab('login');
                                        setAuthModalVisible(true);
                                    }}
                                    className='text-gray-600 hover:text-gray-900'
                                >
                                    登录
                                </Button>
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        setAuthModalTab('register');
                                        setAuthModalVisible(true);
                                    }}
                                    className='bg-gradient-to-r from-blue-500 to-indigo-600 border-none hover:shadow-lg transition-shadow'
                                >
                                    注册
                                </Button>
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
                    selectedKeys={getSelectedKey()}
                    onClick={handleMenuClick}
                    items={menuItems.map((item) => ({
                        key: item.key,
                        label: item.label,
                        icon: item.icon
                    }))}
                    className='border-none'
                />
            </Drawer>

            {/* 主内容区 */}
            <Content className='mt-16'>
                <div className='min-h-[calc(100vh-4rem-200px)]'>{children}</div>
            </Content>

            {/* 底部 */}
            <Footer className='bg-white border-t border-gray-200 mt-auto'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                        {/* 关于 */}
                        <div>
                            <h3 className='text-sm font-semibold text-gray-900 mb-4'>关于</h3>
                            <p className='text-sm text-gray-600'>
                                上下文工程六要素工具，帮助您快速构建高质量的 AI 提示词。
                            </p>
                        </div>

                        {/* 快速链接 */}
                        <div>
                            <h3 className='text-sm font-semibold text-gray-900 mb-4'>快速链接</h3>
                            <ul className='space-y-2'>
                                <li>
                                    <a
                                        href='/'
                                        className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
                                    >
                                        首页
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='/generator'
                                        className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
                                    >
                                        生成器
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='/templates'
                                        className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
                                    >
                                        模板库
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 资源 */}
                        <div>
                            <h3 className='text-sm font-semibold text-gray-900 mb-4'>资源</h3>
                            <ul className='space-y-2'>
                                <li>
                                    <a
                                        href='https://github.com/zsy619/cese-kiro'
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
                                    >
                                        GitHub
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
                                    >
                                        文档
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href='#'
                                        className='text-sm text-gray-600 hover:text-blue-600 transition-colors'
                                    >
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 联系 */}
                        <div>
                            <h3 className='text-sm font-semibold text-gray-900 mb-4'>联系我们</h3>
                            <ul className='space-y-2'>
                                <li className='text-sm text-gray-600'>邮箱: support@cese.com</li>
                                <li className='text-sm text-gray-600'>微信: CESE_Support</li>
                            </ul>
                        </div>
                    </div>

                    {/* 版权信息 */}
                    <div className='pt-8 border-t border-gray-200'>
                        <p className='text-center text-sm text-gray-500'>
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

export default ModernLayout;
