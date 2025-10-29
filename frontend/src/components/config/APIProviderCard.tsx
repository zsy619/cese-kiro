import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Divider,
  Tag,
  Tooltip,
  message
} from 'antd';
import { 
  SettingOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined
} from '@ant-design/icons';
import { APIProvider } from '../../types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface APIProviderCardProps {
  provider: APIProvider;
  onUpdate: (provider: APIProvider) => void;
  onTest?: (provider: APIProvider) => Promise<boolean>;
}

const APIProviderCard: React.FC<APIProviderCardProps> = ({
  provider,
  onUpdate,
  onTest
}) => {
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // 提供商配置信息
  const providerConfigs = {
    openai: {
      name: 'OpenAI',
      description: 'GPT-3.5, GPT-4 等模型',
      defaultBaseUrl: 'https://api.openai.com/v1',
      defaultModels: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
      icon: '🤖',
      color: '#10a37f'
    },
    baidu: {
      name: '百度文心一言',
      description: 'ERNIE 系列模型',
      defaultBaseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      defaultModels: ['ERNIE-Bot', 'ERNIE-Bot-turbo', 'ERNIE-Bot-4'],
      icon: '🐻',
      color: '#2932e1'
    },
    alibaba: {
      name: '阿里通义千问',
      description: 'Qwen 系列模型',
      defaultBaseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      defaultModels: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
      icon: '☁️',
      color: '#ff6a00'
    },
    tencent: {
      name: '腾讯混元',
      description: 'Hunyuan 系列模型',
      defaultBaseUrl: 'https://hunyuan.tencentcloudapi.com',
      defaultModels: ['hunyuan-lite', 'hunyuan-standard', 'hunyuan-pro'],
      icon: '🐧',
      color: '#00a971'
    },
    bytedance: {
      name: '字节豆包',
      description: 'Doubao 系列模型',
      defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      defaultModels: ['doubao-lite-4k', 'doubao-pro-4k', 'doubao-pro-32k'],
      icon: '🎯',
      color: '#1664ff'
    },
    ollama: {
      name: 'Ollama 本地',
      description: '本地部署的开源模型',
      defaultBaseUrl: 'http://localhost:11434/api',
      defaultModels: ['llama2', 'codellama', 'mistral', 'deepseek-coder'],
      icon: '🏠',
      color: '#8b5cf6'
    }
  };

  const config = providerConfigs[provider.type];

  // 处理表单提交
  const handleSubmit = (values: any) => {
    const updatedProvider: APIProvider = {
      ...provider,
      ...values,
      models: values.models || config.defaultModels
    };
    onUpdate(updatedProvider);
    setIsEditing(false);
    message.success(`${config.name} 配置已保存`);
  };

  // 处理连接测试
  const handleTest = async () => {
    if (!onTest) return;
    
    setTesting(true);
    setTestResult(null);
    
    try {
      const result = await onTest(provider);
      setTestResult(result ? 'success' : 'error');
      message[result ? 'success' : 'error'](
        result ? '连接测试成功' : '连接测试失败'
      );
    } catch (error) {
      setTestResult('error');
      message.error('连接测试失败');
    } finally {
      setTesting(false);
    }
  };

  // 重置为默认配置
  const handleReset = () => {
    const defaultProvider: APIProvider = {
      ...provider,
      baseUrl: config.defaultBaseUrl,
      models: config.defaultModels,
      apiKey: '',
      config: {}
    };
    form.setFieldsValue(defaultProvider);
  };

  // 获取状态颜色和图标
  const getStatusDisplay = () => {
    if (testing) {
      return {
        color: '#1890ff',
        icon: <LoadingOutlined spin />,
        text: '测试中...'
      };
    }
    
    if (testResult === 'success') {
      return {
        color: '#52c41a',
        icon: <CheckCircleOutlined />,
        text: '连接正常'
      };
    }
    
    if (testResult === 'error') {
      return {
        color: '#ff4d4f',
        icon: <ExclamationCircleOutlined />,
        text: '连接失败'
      };
    }
    
    if (!provider.enabled) {
      return {
        color: '#d9d9d9',
        icon: <ExclamationCircleOutlined />,
        text: '已禁用'
      };
    }
    
    return {
      color: '#faad14',
      icon: <InfoCircleOutlined />,
      text: '未测试'
    };
  };

  const status = getStatusDisplay();

  return (
    <Card
      className='mb-6 shadow-sm hover:shadow-md transition-shadow duration-200'
      title={
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='text-2xl mr-3'>{config.icon}</span>
            <div>
              <Title level={4} className='!mb-0' style={{ color: config.color }}>
                {config.name}
              </Title>
              <Text type='secondary' className='text-sm'>
                {config.description}
              </Text>
            </div>
          </div>
          
          <div className='flex items-center space-x-3'>
            <Tag color={status.color} icon={status.icon}>
              {status.text}
            </Tag>
            <Switch
              checked={provider.enabled}
              onChange={(enabled) => onUpdate({ ...provider, enabled })}
              checkedChildren='启用'
              unCheckedChildren='禁用'
            />
          </div>
        </div>
      }
      extra={
        <Space>
          {!isEditing ? (
            <>
              <Button
                type='primary'
                icon={<SettingOutlined />}
                onClick={() => setIsEditing(true)}
              >
                配置
              </Button>
              <Button
                onClick={handleTest}
                loading={testing}
                disabled={!provider.enabled || !provider.apiKey}
              >
                测试连接
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button
                type='primary'
                onClick={() => form.submit()}
              >
                保存
              </Button>
            </>
          )}
        </Space>
      }
    >
      {isEditing ? (
        <Form
          form={form}
          layout='vertical'
          initialValues={provider}
          onFinish={handleSubmit}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* 基础配置 */}
            <div>
              <Title level={5} className='!mb-4'>基础配置</Title>
              
              <Form.Item
                label='API Key'
                name='apiKey'
                rules={[{ required: true, message: '请输入 API Key' }]}
              >
                <Input.Password
                  placeholder='请输入 API Key'
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span>
                    Base URL
                    <Tooltip title='API 服务的基础地址'>
                      <InfoCircleOutlined className='ml-1 text-gray-400' />
                    </Tooltip>
                  </span>
                }
                name='baseUrl'
                rules={[{ required: true, message: '请输入 Base URL' }]}
              >
                <Input placeholder={config.defaultBaseUrl} />
              </Form.Item>

              <Form.Item
                label='支持的模型'
                name='models'
              >
                <Select
                  mode='tags'
                  placeholder='选择或输入模型名称'
                  defaultValue={config.defaultModels}
                >
                  {config.defaultModels.map(model => (
                    <Option key={model} value={model}>
                      {model}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* 高级配置 */}
            <div>
              <Title level={5} className='!mb-4'>高级配置</Title>
              
              <Form.Item
                label='请求超时 (秒)'
                name={['config', 'timeout']}
              >
                <Input type='number' placeholder='30' min={1} max={300} />
              </Form.Item>

              <Form.Item
                label='最大重试次数'
                name={['config', 'maxRetries']}
              >
                <Input type='number' placeholder='3' min={0} max={10} />
              </Form.Item>

              <Form.Item
                label='自定义请求头'
                name={['config', 'headers']}
              >
                <TextArea
                  placeholder='JSON 格式，例如：{"User-Agent": "MyApp/1.0"}'
                  rows={3}
                />
              </Form.Item>
            </div>
          </div>

          <Divider />
          
          <div className='flex justify-between'>
            <Button onClick={handleReset}>
              重置为默认配置
            </Button>
            <Space>
              <Button onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button type='primary' htmlType='submit'>
                保存配置
              </Button>
            </Space>
          </div>
        </Form>
      ) : (
        <div className='space-y-4'>
          {/* 配置概览 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div>
              <Text type='secondary' className='text-sm'>API Key</Text>
              <div className='mt-1'>
                {provider.apiKey ? (
                  <Text code>{'*'.repeat(8)}...{provider.apiKey.slice(-4)}</Text>
                ) : (
                  <Text type='secondary'>未配置</Text>
                )}
              </div>
            </div>
            
            <div>
              <Text type='secondary' className='text-sm'>Base URL</Text>
              <div className='mt-1'>
                <Text code className='text-xs'>{provider.baseUrl || config.defaultBaseUrl}</Text>
              </div>
            </div>
            
            <div>
              <Text type='secondary' className='text-sm'>支持模型</Text>
              <div className='mt-1'>
                <Space size={[4, 4]} wrap>
                  {(provider.models || config.defaultModels).slice(0, 3).map(model => (
                    <Tag key={model} className='text-xs'>{model}</Tag>
                  ))}
                  {(provider.models || config.defaultModels).length > 3 && (
                    <Tag className='text-xs'>+{(provider.models || config.defaultModels).length - 3}</Tag>
                  )}
                </Space>
              </div>
            </div>
          </div>

          {/* 状态信息 */}
          {!provider.enabled && (
            <Alert
              message='此提供商已禁用'
              description='启用后才能使用此 API 提供商的服务'
              type='warning'
              showIcon
            />
          )}
          
          {provider.enabled && !provider.apiKey && (
            <Alert
              message='需要配置 API Key'
              description='请点击"配置"按钮添加 API Key 以使用此服务'
              type='info'
              showIcon
            />
          )}
        </div>
      )}
    </Card>
  );
};

export default APIProviderCard;