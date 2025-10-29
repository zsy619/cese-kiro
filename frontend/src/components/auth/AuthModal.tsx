import React, { useState } from 'react';
import { 
  Modal, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Checkbox, 
  Typography, 
  Divider,
  Space,
  Alert,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyOutlined
} from '@ant-design/icons';
import { LoginForm, RegisterForm, User } from '../../types';

const { Title, Text, Link } = Typography;

interface AuthModalProps {
  visible: boolean;
  onCancel: () => void;
  onLogin: (loginData: LoginForm) => Promise<void>;
  onRegister: (registerData: RegisterForm) => Promise<void>;
  loading?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({
  visible,
  onCancel,
  onLogin,
  onRegister,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  // 处理登录
  const handleLogin = async (values: LoginForm) => {
    try {
      await onLogin(values);
      loginForm.resetFields();
      onCancel();
      message.success('登录成功');
    } catch (error) {
      message.error('登录失败，请检查手机号和密码');
    }
  };

  // 处理注册
  const handleRegister = async (values: RegisterForm) => {
    try {
      await onRegister(values);
      registerForm.resetFields();
      setActiveTab('login');
      message.success('注册成功，请登录');
    } catch (error) {
      message.error('注册失败，请重试');
    }
  };

  // 手机号验证规则
  const phoneRules = [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
  ];

  // 密码验证规则
  const passwordRules = [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6位字符' },
    { max: 20, message: '密码不能超过20位字符' }
  ];

  // 确认密码验证规则
  const confirmPasswordRules = [
    { required: true, message: '请确认密码' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('两次输入的密码不一致'));
      }
    })
  ];

  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <div className='px-4 pb-4'>
          <div className='text-center mb-6'>
            <Title level={3} className='!mb-2'>
              欢迎回来
            </Title>
            <Text type='secondary'>
              登录您的账户继续使用服务
            </Text>
          </div>

          <Form
            form={loginForm}
            name='login'
            onFinish={handleLogin}
            layout='vertical'
            size='large'
          >
            <Form.Item
              name='phone'
              rules={phoneRules}
            >
              <Input
                prefix={<PhoneOutlined className='text-gray-400' />}
                placeholder='请输入手机号'
                maxLength={11}
              />
            </Form.Item>

            <Form.Item
              name='password'
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className='text-gray-400' />}
                placeholder='请输入密码'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <div className='flex justify-between items-center'>
                <Form.Item name='remember' valuePropName='checked' noStyle>
                  <Checkbox>记住登录状态</Checkbox>
                </Form.Item>
                <Link className='text-blue-500'>
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='w-full'
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text type='secondary'>其他登录方式</Text>
          </Divider>

          <div className='text-center'>
            <Text type='secondary'>
              还没有账户？
              <Link onClick={() => setActiveTab('register')} className='ml-1'>
                立即注册
              </Link>
            </Text>
          </div>
        </div>
      )
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <div className='px-4 pb-4'>
          <div className='text-center mb-6'>
            <Title level={3} className='!mb-2'>
              创建账户
            </Title>
            <Text type='secondary'>
              注册新账户开始使用服务
            </Text>
          </div>

          <Form
            form={registerForm}
            name='register'
            onFinish={handleRegister}
            layout='vertical'
            size='large'
          >
            <Form.Item
              name='phone'
              rules={phoneRules}
            >
              <Input
                prefix={<PhoneOutlined className='text-gray-400' />}
                placeholder='请输入手机号'
                maxLength={11}
              />
            </Form.Item>

            <Form.Item
              name='password'
              rules={passwordRules}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className='text-gray-400' />}
                placeholder='请设置密码（6-20位字符）'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name='confirmPassword'
              dependencies={['password']}
              rules={confirmPasswordRules}
              hasFeedback
            >
              <Input.Password
                prefix={<SafetyOutlined className='text-gray-400' />}
                placeholder='请确认密码'
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Alert
                message='注册须知'
                description='注册即表示您同意我们的服务条款和隐私政策。我们承诺保护您的个人信息安全。'
                type='info'
                showIcon
                className='mb-4'
              />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='w-full'
                loading={loading}
              >
                注册账户
              </Button>
            </Form.Item>
          </Form>

          <div className='text-center'>
            <Text type='secondary'>
              已有账户？
              <Link onClick={() => setActiveTab('login')} className='ml-1'>
                立即登录
              </Link>
            </Text>
          </div>
        </div>
      )
    }
  ];

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      centered
      destroyOnClose
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'login' | 'register')}
        centered
        items={tabItems}
      />
    </Modal>
  );
};

export default AuthModal;