import React from 'react';
import { Typography, Breadcrumb } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { useApp } from '../../contexts/AppContext';
import APIConfigManager from '../../components/config/APIConfigManager';

const { Title, Paragraph } = Typography;

const ConfigPage: React.FC = () => {
  const { state, dispatch } = useApp();

  // 处理配置变化
  const handleConfigChange = (newConfig: any) => {
    dispatch({ type: 'SET_API_CONFIG', payload: newConfig });
  };

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* 面包屑导航 */}
        <Breadcrumb className='mb-4'>
          <Breadcrumb.Item href='/'>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <SettingOutlined />
            <span>API配置</span>
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* 页面标题 */}
        <div className='mb-8'>
          <Title level={1} className='!mb-4'>
            API 配置管理
          </Title>
          <Paragraph className='text-lg text-gray-600 max-w-3xl'>
            配置和管理多个 AI 模型提供商的 API 接口，支持 OpenAI、百度文心一言、阿里通义千问、腾讯混元、字节豆包和本地 Ollama 等服务。
          </Paragraph>
        </div>

        {/* API 配置管理器 */}
        <APIConfigManager
          config={state.apiConfig}
          onConfigChange={handleConfigChange}
        />
      </div>
    </div>
  );
};

export default ConfigPage;