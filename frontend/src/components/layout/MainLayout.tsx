import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, message } from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    FolderOutlined,
    SettingOutlined,
    UserOutlined,
    LoginOutlined,
    LogoutOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import AuthModal from '../auth/AuthModal';
import UserPreferencesModal from '../common/UserPreferences';
import { authService } from '../../services/authService';
import type { MenuItem, LoginForm, RegisterForm } from '../../types';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, logout, setUser, setAuthenticated } = useApp();
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    // 主导航菜单项
    const menuItems: MenuItem[] = [
        {
            key: 'home',
            label: '首页',
            icon: <HomeOutlined />,
            path: '/'
        },
        {
            key: 'generator',
            label: '模板生成',
            icon: <FileTextOutlined />,
            path: '/generator'
        },
        {
            key: 'templates',
            label: '我的模板',
            icon: <FolderOutlined />,
            path: '/templates',
            requireAuth: true
        },
        {
            key: 'config',
            label: 'API配置',
            icon: <SettingOutlined />,
            path: '/config'
        }
    ];

    // 获取当前选中的菜单项
    const getSelectedKey = () => {
        const currentPath = location.pathname;
        const item = menuItems.find(item => item.path === currentPath);
        return item ? [item.key] : ['home'];
    };

    // 处理菜单点击
    const handleMenuClick = ({ key }: { key: string }) => {
        const item = menuItems.find(item => item.key === key);
        if (item?.path) {
            navigate(item.path);
        }
        setMobileMenuVisible(false);
    };

    // 认证弹窗状态
    const [authModalVisible, setAuthModalVisible] = useState(false);
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
    const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);

    // 处理登录按钮点击
    const handleLogin = () => {
        setAuthModalTab('login');
        setAuthModalVisible(true);
    };

    // 处理注册按钮点击
    const handleRegister = () => {
        setAuthModalTab('register');
        setAuthModalVisible(true);
    };

    // 处理登录
    const handleLoginSubmit = async (loginData: LoginForm) => {
        setAuthLoading(true);
        try {
            const response = await authService.login(loginData);
            setUser(response.user);
            setAuthenticated(true);
            setAuthModalVisible(false);
            message.success('登录成功');
        } catch (error) {
            throw error; // 让 AuthModal 处理错误
        } finally {
            setAuthLoading(false);
        }
    };

    // 处理注册
    const handleRegisterSubmit = async (registerData: RegisterForm) => {
        setAuthLoading(true);
        try {
            await authService.register(registerData);
            message.success('注册成功，请登录');
        } catch (error) {
            throw error; // 让 AuthModal 处理错误
        } finally {
            setAuthLoading(false);
        }
    };

    // 处理登出
    const handleLogout = () => {
        authService.logout();
        logout();
        navigate('/');
        message.success('已退出登录');
    };

    // 用户下拉菜单
    const userMenuItems = [
        {
            key: 'profile',
            label: '个人资料',
            icon: <UserOutlined />
        },
        {
            key: 'preferences',
            label: '偏好设置',
            icon: <SettingOutlined />,
            onClick: () => setPreferencesModalVisible(true)
        },
        {
            type: 'divider' as const
        },
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            onClick: handleLogout
        }
    ];

    return (
        <Layout className='min-h-screen'>
            <Header className='flex items-center justify-between px-6 bg-white shadow-sm'>
                {/* Logo 和标题 */}
                <div className='flex items-center'>
                    <div
                        className='flex items-center cursor-pointer'
                        onClick={() => navigate('/')}
                    >
                        <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3'>
                            <span className='text-white font-bold text-lg'>C</span>
                        </div>
                        <Title level={4} className='!mb-0 !text-gray-800'>
                            上下文工程六要素
                        </Title>
                    </div>
                </div>

                {/* 桌面端导航菜单 */}
                <div className='hidden md:flex flex-1 justify-center'>
                    <Menu
                        mode='horizontal'
                        selectedKeys={getSelectedKey()}
                        onClick={handleMenuClick}
                        className='border-none bg-transparent'
                        items={menuItems.map(item => ({
                            key: item.key,
                            label: item.label,
                            icon: item.icon,
                            disabled: item.requireAuth && !state.isAuthenticated
                        }))}
                    />
                </div>

                {/* 用户操作区域 */}
                <div className='flex items-center space-x-4'>
                    {state.isAuthenticated ? (
                        // 已登录状态
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement='bottomRight'
                            arrow
                        >
                            <Space className='cursor-pointer'>
                                <Avatar
                                    size='small'
                                    icon={<UserOutlined />}
                                    src={state.user?.avatar}
                                />
                                <span className='hidden sm:inline text-gray-700'>
                                    {state.user?.nickname || state.user?.phone}
                                </span>
                            </Space>
                        </Dropdown>
                    ) : (
                        // 未登录状态
                        <Space>
                            <Button
                                type='text'
                                icon={<LoginOutlined />}
                                onClick={handleLogin}
                            >
                                登录
                            </Button>
                            <Button
                                type='primary'
                                onClick={handleRegister}
                            >
                                注册
                            </Button>
                        </Space>
                    )}

                    {/* 移动端菜单按钮 */}
                    <Button
                        type='text'
                        icon={<MenuOutlined />}
                        className='md:hidden'
                        onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
                    />
                </div>
            </Header>

            {/* 移动端导航菜单 */}
            {mobileMenuVisible && (
                <div className='md:hidden bg-white border-b shadow-sm'>
                    <Menu
                        mode='vertical'
                        selectedKeys={getSelectedKey()}
                        onClick={handleMenuClick}
                        className='border-none'
                        items={menuItems.map(item => ({
                            key: item.key,
                            label: item.label,
                            icon: item.icon,
                            disabled: item.requireAuth && !state.isAuthenticated
                        }))}
                    />
                </div>
            )}

            {/* 主内容区域 */}
            <Content className='flex-1 bg-gray-50'>
                {children}
            </Content>

            {/* 底部信息栏 */}
            <Footer className='text-center bg-white border-t'>
                <div className='max-w-6xl mx-auto py-4'>
                    <p className='text-gray-600 mb-2'>
                        上下文工程六要素小工具 - 让 AI 提示词生成更简单
                    </p>
                    <p className='text-gray-400 text-sm'>
                        © 2024 Context Engineering Six Elements Tool.
                        <a
                            href='https://github.com/zsy619/cese-kiro'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='ml-2 text-blue-500 hover:text-blue-600'
                        >
                            GitHub
                        </a>
                    </p>
                </div>
            </Footer>

            {/* 认证弹窗 */}
            <AuthModal
                visible={authModalVisible}
                onClose={() => setAuthModalVisible(false)}
                defaultTab={authModalTab}
            />

            {/* 用户偏好设置弹窗 */}
            <UserPreferencesModal
                open={preferencesModalVisible}
                onCancel={() => setPreferencesModalVisible(false)}
            />
        </Layout>
    );
};

export default MainLayout;
