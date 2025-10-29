import React, { useState } from 'react';
import { Card, Typography, Button, Space, message, Tabs, Divider } from 'antd';
import { 
  CopyOutlined, 
  DownloadOutlined, 
  SaveOutlined,
  EyeOutlined,
  CodeOutlined 
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { SixElements } from '../../types';

const { Title, Text, Paragraph } = Typography;

interface PromptPreviewProps {
  elements: SixElements;
  onSave?: (elements: SixElements) => void;
  onCopy?: (content: string, format: 'markdown' | 'json') => void;
  onExport?: (content: string, format: 'markdown' | 'json') => void;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({
  elements,
  onSave,
  onCopy,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState('preview');

  // 生成 Markdown 格式的提示词
  const generateMarkdown = () => {
    const { taskGoal, aiRole, userRole, keyInfo, behaviorRules, deliveryFormat } = elements;
    
    return `# 提示词模板

## 任务目标
${taskGoal || ''}

## AI的角色
${aiRole || ''}

## 我的角色
${userRole || ''}

## 关键信息
${keyInfo || ''}

## 行为规则
${behaviorRules || ''}

## 交付格式
${deliveryFormat || ''}`;
  };

  // 生成 JSON 格式的提示词
  const generateJSON = () => {
    return JSON.stringify({
      template: {
        taskGoal: elements.taskGoal || '',
        aiRole: elements.aiRole || '',
        userRole: elements.userRole || '',
        keyInfo: elements.keyInfo || '',
        behaviorRules: elements.behaviorRules || '',
        deliveryFormat: elements.deliveryFormat || ''
      },
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0'
      }
    }, null, 2);
  };

  // 生成完整的提示词文本
  const generatePromptText = () => {
    const { taskGoal, aiRole, userRole, keyInfo, behaviorRules, deliveryFormat } = elements;
    
    let prompt = '';
    
    if (taskGoal) {
      prompt += `## 任务目标\n${taskGoal}\n\n`;
    }
    
    if (aiRole) {
      prompt += `## AI的角色\n${aiRole}\n\n`;
    }
    
    if (userRole) {
      prompt += `## 我的角色\n${userRole}\n\n`;
    }
    
    if (keyInfo) {
      prompt += `## 关键信息\n${keyInfo}\n\n`;
    }
    
    if (behaviorRules) {
      prompt += `## 行为规则\n${behaviorRules}\n\n`;
    }
    
    if (deliveryFormat) {
      prompt += `## 交付格式\n${deliveryFormat}`;
    }
    
    return prompt;
  };

  // 处理复制操作
  const handleCopy = async (format: 'markdown' | 'json' | 'text') => {
    try {
      let content = '';
      
      switch (format) {
      case 'markdown':
        content = generateMarkdown();
        break;
      case 'json':
        content = generateJSON();
        break;
      case 'text':
        content = generatePromptText();
        break;
      }
      
      await navigator.clipboard.writeText(content);
      message.success(`已复制${format.toUpperCase()}格式内容到剪贴板`);
      onCopy?.(content, format as 'markdown' | 'json');
    } catch (error) {
      message.error('复制失败，请手动选择复制');
    }
  };

  // 处理导出操作
  const handleExport = (format: 'markdown' | 'json') => {
    const content = format === 'markdown' ? generateMarkdown() : generateJSON();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt-template.${format === 'markdown' ? 'md' : 'json'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success(`已导出${format.toUpperCase()}文件`);
    onExport?.(content, format);
  };

  // 处理保存操作
  const handleSave = () => {
    onSave?.(elements);
    message.success('模板已保存');
  };

  // 检查是否有内容
  const hasContent = Object.values(elements).some(value => value && value.trim());

  if (!hasContent) {
    return (
      <Card className='text-center py-12'>
        <EyeOutlined className='text-4xl text-gray-300 mb-4' />
        <Title level={4} type='secondary'>
          暂无预览内容
        </Title>
        <Text type='secondary'>
          请在左侧填写六要素信息，这里将实时显示生成的提示词预览
        </Text>
      </Card>
    );
  }

  const tabItems = [
    {
      key: 'preview',
      label: (
        <span>
          <EyeOutlined />
          预览
        </span>
      ),
      children: (
        <div className='prose max-w-none'>
          <ReactMarkdown>{generatePromptText()}</ReactMarkdown>
        </div>
      )
    },
    {
      key: 'markdown',
      label: (
        <span>
          <CodeOutlined />
          Markdown
        </span>
      ),
      children: (
        <pre className='bg-gray-50 p-4 rounded-lg overflow-auto text-sm'>
          <code>{generateMarkdown()}</code>
        </pre>
      )
    },
    {
      key: 'json',
      label: (
        <span>
          <CodeOutlined />
          JSON
        </span>
      ),
      children: (
        <pre className='bg-gray-50 p-4 rounded-lg overflow-auto text-sm'>
          <code>{generateJSON()}</code>
        </pre>
      )
    }
  ];

  return (
    <Card 
      title={
        <div className='flex items-center justify-between'>
          <Title level={4} className='!mb-0'>
            提示词预览
          </Title>
          <Space>
            <Button 
              type='text' 
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              保存模板
            </Button>
          </Space>
        </div>
      }
      className='h-full'
    >
      <Tabs 
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className='min-h-96'
      />
      
      <Divider />
      
      <div className='flex flex-wrap gap-2 justify-center'>
        <Button 
          icon={<CopyOutlined />}
          onClick={() => handleCopy('text')}
        >
          复制文本
        </Button>
        <Button 
          icon={<CopyOutlined />}
          onClick={() => handleCopy('markdown')}
        >
          复制 Markdown
        </Button>
        <Button 
          icon={<CopyOutlined />}
          onClick={() => handleCopy('json')}
        >
          复制 JSON
        </Button>
        <Button 
          icon={<DownloadOutlined />}
          onClick={() => handleExport('markdown')}
        >
          导出 MD
        </Button>
        <Button 
          icon={<DownloadOutlined />}
          onClick={() => handleExport('json')}
        >
          导出 JSON
        </Button>
      </div>
    </Card>
  );
};

export default PromptPreview;