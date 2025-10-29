import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Modal, 
  Upload, 
  message,
  Statistic,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  ImportOutlined, 
  ExportOutlined, 
  ReloadOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { APIProvider, APIConfig } from '../../types';
import APIProviderCard from './APIProviderCard';

const { Title, Text, Paragraph } = Typography;

interface APIConfigManagerProps {
  config: APIConfig;
  onConfigChange: (config: APIConfig) => void;
}

const APIConfigManager: React.FC<APIConfigManagerProps> = ({
  config,
  onConfigChange
}) => {
  const [testingAll, setTestingAll] = useState(false);

  // 默认提供商配置
  const defaultProviders: Omit<APIProvider, 'id'>[] = [
    {
      name: 'OpenAI',
      type: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
      enabled: false
    },
    {
      name: '百度文心一言',
      type: 'baidu',
      baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      models: ['ERNIE-Bot', 'ERNIE-Bot-turbo', 'ERNIE-Bot-4'],
      enabled: false
    },
    {
      name: '阿里通义千问',
      type: 'alibaba',
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
      enabled: false
    },
    {
      name: '腾讯混元',
      type: 'tencent',
      baseUrl: 'https://hunyuan.tencentcloudapi.com',
      models: ['hunyuan-lite', 'hunyuan-standard', 'hunyuan-pro'],
      enabled: false
    },
    {
      name: '字节豆包',
      type: 'bytedance',
      baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
      models: ['doubao-lite-4k', 'doubao-pro-4k', 'doubao-pro-32k'],
      enabled: false
    },
    {
      name: 'Ollama 本地',
      type: 'ollama',
      baseUrl: 'http://localhost:11434/api',
      models: ['llama2', 'codellama', 'mistral', 'deepseek-coder'],
      enabled: false
    }
  ];

  // 初始化提供商（如果配置为空）
  const initializeProviders = () => {
    if (config.providers.length === 0) {
      const initialProviders: APIProvider[] = defaultProviders.map((provider, index) => ({
        ...provider,
        id: `provider_${index + 1}`
      }));
      
      onConfigChange({
        ...config,
        providers: initialProviders
      });
    }
  };

  // 如果没有提供商，初始化默认提供商
  React.useEffect(() => {
    initializeProviders();
  }, []);

  // 更新提供商配置
  const handleProviderUpdate = (updatedProvider: APIProvider) => {
    const updatedProviders = config.providers.map(provider =>
      provider.id === updatedProvider.id ? updatedProvider : provider
    );
    
    onConfigChange({
      ...config,
      providers: updatedProviders
    });
  };

  // 测试单个提供商连接
  const testProviderConnection = async (provider: APIProvider): Promise<boolean> => {
    // 模拟 API 测试
    return new Promise((resolve) => {
      setTimeout(() => {
        // 简单的验证逻辑：检查是否有 API Key 和 Base URL
        const isValid = !!(provider.apiKey && provider.baseUrl);
        resolve(isValid);
      }, 1000 + Math.random() * 2000);
    });
  };

  // 测试所有启用的提供商
  const testAllConnections = async () => {
    setTestingAll(true);
    const enabledProviders = config.providers.filter(p => p.enabled);
    
    if (enabledProviders.length === 0) {
      message.warning('没有启用的 API 提供商');
      setTestingAll(false);
      return;
    }

    try {
      const results = await Promise.all(
        enabledProviders.map(provider => testProviderConnection(provider))
      );
      
      const successCount = results.filter(Boolean).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        message.success(`所有 ${totalCount} 个提供商连接测试成功`);
      } else {
        message.warning(`${successCount}/${totalCount} 个提供商连接成功`);
      }
    } catch (error) {
      message.error('批量测试失败');
    } finally {
      setTestingAll(false);
    }
  };

  // 导出配置
  const handleExportConfig = () => {
    const exportData = {
      ...config,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success('配置已导出');
  };

  // 导入配置
  const handleImportConfig = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        
        // 验证配置格式
        if (!importedConfig.providers || !Array.isArray(importedConfig.providers)) {
          throw new Error('无效的配置文件格式');
        }

        Modal.confirm({
          title: '确认导入配置',
          content: `将导入 ${importedConfig.providers.length} 个 API 提供商配置，这将覆盖当前配置。`,
          onOk: () => {
            onConfigChange(importedConfig);
            message.success('配置导入成功');
          }
        });
      } catch (error) {
        message.error('配置文件格式错误');
      }
    };
    reader.readAsText(file);
    return false; // 阻止自动上传
  };

  // 重置所有配置
  const handleResetConfig = () => {
    Modal.confirm({
      title: '确认重置配置',
      content: '这将清除所有 API 配置并恢复默认设置，此操作无法撤销。',
      okType: 'danger',
      onOk: () => {
        const resetProviders: APIProvider[] = defaultProviders.map((provider, index) => ({
          ...provider,
          id: `provider_${index + 1}`
        }));
        
        onConfigChange({
          providers: resetProviders,
          defaultProvider: undefined
        });
        
        message.success('配置已重置');
      }
    });
  };

  // 设置默认提供商
  const handleSetDefault = (providerId: string) => {
    onConfigChange({
      ...config,
      defaultProvider: providerId
    });
    message.success('默认提供商已设置');
  };

  // 统计信息
  const enabledCount = config.providers.filter(p => p.enabled).length;
  const configuredCount = config.providers.filter(p => p.enabled && p.apiKey).length;

  return (
    <div className='space-y-6'>
      {/* 统计信息 */}
      <Row gutter={16}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title='总提供商'
              value={config.providers.length}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title='已启用'
              value={enabledCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: enabledCount > 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title='已配置'
              value={configuredCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: configuredCount > 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title='默认提供商'
              value={config.defaultProvider ? '已设置' : '未设置'}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: config.defaultProvider ? '#3f8600' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <Card>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div>
            <Title level={4} className='!mb-1'>
              API 提供商管理
            </Title>
            <Text type='secondary'>
              配置和管理多个 AI 模型 API 提供商
            </Text>
          </div>
          
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              onClick={testAllConnections}
              loading={testingAll}
            >
              测试所有连接
            </Button>
            
            <Upload
              accept='.json'
              beforeUpload={handleImportConfig}
              showUploadList={false}
            >
              <Button icon={<ImportOutlined />}>
                导入配置
              </Button>
            </Upload>
            
            <Button
              icon={<ExportOutlined />}
              onClick={handleExportConfig}
            >
              导出配置
            </Button>
            
            <Button
              danger
              onClick={handleResetConfig}
            >
              重置配置
            </Button>
          </Space>
        </div>
      </Card>

      {/* 使用说明 */}
      <Alert
        message='配置说明'
        description={
          <div className='space-y-2'>
            <Paragraph className='!mb-2'>
              • 每个 API 提供商需要单独配置 API Key 才能使用
            </Paragraph>
            <Paragraph className='!mb-2'>
              • 建议先测试连接确保配置正确
            </Paragraph>
            <Paragraph className='!mb-0'>
              • 可以设置一个默认提供商用于快速生成
            </Paragraph>
          </div>
        }
        type='info'
        showIcon
        className='mb-6'
      />

      {/* 提供商配置列表 */}
      <div className='space-y-4'>
        {config.providers.map(provider => (
          <APIProviderCard
            key={provider.id}
            provider={provider}
            onUpdate={handleProviderUpdate}
            onTest={testProviderConnection}
          />
        ))}
      </div>

      {/* 空状态 */}
      {config.providers.length === 0 && (
        <Card className='text-center py-12'>
          <div className='space-y-4'>
            <div className='text-4xl'>🔧</div>
            <Title level={4}>暂无 API 提供商配置</Title>
            <Text type='secondary'>
              点击上方按钮添加 API 提供商配置
            </Text>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={initializeProviders}
            >
              初始化默认配置
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default APIConfigManager;