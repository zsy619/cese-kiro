import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import type { LoginForm, RegisterForm } from '../../types';

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({
    visible,
    onClose,
    defaultTab = 'login'
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { setUser, setAuthenticated } = useApp();

    // 处理登录
    const handleLogin = async (values: LoginForm) => {
        setLoading(true);
        try {
            // TODO: 调用实际的登录 API
            // const response = await authService.login(values);

            // 模拟登录成功
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser = {
                id: '1',
                phone: values.phone,
                nickname: '用户' + values.phone.slice(-4),
                createdAt: new Date().toISOString()
            };

            // 保存用户信息和 token
            localStorage.setItem('token', 'mock-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(mockUser));

            setUser(mockUser);
            setAuthenticated(true);

            message.success('登录成功！');
            onClose();
            loginForm.resetFields();
        } catch (error) {
            message.error('登录失败，请检查手机号和密码');
        } finally {
            setLoading(false);
        }
    };

    // 处理注册
    const handleRegister = async (values: RegisterForm) => {
        setLoading(true);
        try {
            // TODO: 调用实际的注册 API
            // const response = await authService.register(values);

            // 模拟注册成功
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser = {
                id: '1',
                phone: values.phone,
                nickname: '用户' + values.phone.slice(-4),
                createdAt: new Date().toISOString()
            };

            // 保存用户信息和 token
            localStorage.setItem('token', 'mock-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(mockUser));

            setUser(mockUser);
            setAuthenticated(true);

            message.success('注册成功！');
            onClose();
            registerForm.resetFields();
        } catch (error) {
            message.error('注册失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 登录表单
    const LoginForm = () => (
        <Form
            form={loginForm}
            name='login'
            onFinish={handleLogin}
            autoComplete='off'
            size='large'
        >
            <Form.Item
                name='phone'
                rules={[
                    { required: true, message: '请输入手机号' },
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ]}
            >
                <Input
                    prefix={<PhoneOutlined />}
                    placeholder='手机号'
                />
            </Form.Item>

            <Form.Item
                name='password'
                rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位' }
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='密码'
                />
            </Form.Item>

            <Form.Item>
                <div className='flex justify-between items-center'>
                    <Form.Item name='remember' valuePropName='checked' noStyle>
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>
                    <a className='text-blue-500 hover:text-blue-600'>
                        忘记密码？
                    </a>
                </div>
            </Form.Item>

            <Form.Item>
                <Button
                    type='primary'
                    htmlType='submit'
                    block
                    loading={loading}
                    size='large'
                >
                    登录
                </Button>
            </Form.Item>

            <div className='text-center text-gray-600'>
                还没有账号？
                <a
                    className='text-blue-500 hover:text-blue-600 ml-1'
                    onClick={() => setActiveTab('register')}
                >
                    立即注册
                </a>
            </div>
        </Form>
    );

    // 注册表单
    const RegisterForm = () => (
        <Form
            form={registerForm}
            name='register'
            onFinish={handleRegister}
            autoComplete='off'
            size='large'
        >
            <Form.Item
                name='phone'
                rules={[
                    { required: true, message: '请输入手机号' },
                    {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ]}
            >
                <Input
                    prefix={<PhoneOutlined />}
                    placeholder='手机号'
                />
            </Form.Item>

            <Form.Item
                name='password'
                rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位' },
                    {
                        pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
                        message: '密码必须包含字母和数字'
                    }
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='密码（至少6位，包含字母和数字）'
                />
            </Form.Item>

            <Form.Item
                name='confirmPassword'
                dependencies={['password']}
                rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的密码不一致'));
                        }
                    })
                ]}
            >
                <Input.Password
                    prefix={<LockOutlined />}
                    placeholder='确认密码'
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type='primary'
                    htmlType='submit'
                    block
                    loading={loading}
                    size='large'
                >
                    注册
                </Button>
            </Form.Item>

            <div className='text-center text-gray-600'>
                已有账号？
                <a
                    className='text-blue-500 hover:text-blue-600 ml-1'
                    onClick={() => setActiveTab('login')}
                >
                    立即登录
                </a>
            </div>
        </Form>
    );

    const tabItems = [
        {
            key: 'login',
            label: '登录',
            children: <LoginForm />
        },
        {
            key: 'register',
            label: '注册',
            children: <RegisterForm />
        }
    ];

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
            centered
        >
            <div className='py-4'>
                <div className='text-center mb-6'>
                    <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <UserOutlined className='text-3xl text-white' />
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900'>
                        欢迎使用
                    </h2>
                    <p className='text-gray-600 mt-2'>
                        上下文工程六要素小工具
                    </p>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as 'login' | 'register')}
                    items={tabItems}
                    centered
                />
            </div>
        </Modal>
    );
};

export default AuthModal;
