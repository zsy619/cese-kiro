import React, { useState } from 'react';
import { Row, Col, Typography, Card, message } from 'antd';
import SixElementsForm from '../../components/prompt/SixElementsForm';
import PromptPreview from '../../components/prompt/PromptPreview';
import TemplateMetadata from '../../components/template/TemplateMetadata';
import { SixElements, Template } from '../../types';
import { useApp } from '../../contexts/AppContext';

const { Title, Paragraph } = Typography;

const GeneratorPage: React.FC = () => {
  const { addTemplate } = useApp();
  const [currentElements, setCurrentElements] = useState<SixElements>({
    taskGoal: '',
    aiRole: '',
    userRole: '',
    keyInfo: '',
    behaviorRules: '',
    deliveryFormat: ''
  });
  
  // 模板元数据状态
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateTags, setTemplateTags] = useState<string[]>([]);

  // 处理表单值变化
  const handleElementsChange = (elements: SixElements) => {
    setCurrentElements(elements);
  };

  // 处理表单提交
  const handleSubmit = (elements: SixElements) => {
    message.success('提示词生成成功！请在右侧查看预览结果。');
    setCurrentElements(elements);
  };

  // 处理保存模板
  const handleSaveTemplate = (elements: SixElements) => {
    // 检查是否有足够的内容
    const filledElements = Object.values(elements).filter(value => value && value.trim());
    if (filledElements.length < 3) {
      message.warning('请至少填写3个要素后再保存模板');
      return;
    }

    // 检查模板名称
    if (!templateName.trim()) {
      message.warning('请输入模板名称');
      return;
    }

    // 生成模板
    const template: Template = {
      id: Date.now().toString(),
      name: templateName.trim(),
      description: templateDescription.trim() || '通过六要素生成器创建的模板',
      elements,
      tags: templateTags.length > 0 ? templateTags : ['自定义'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false
    };

    addTemplate(template);
    message.success('模板已保存到我的模板库');
    
    // 清空表单
    setTemplateName('');
    setTemplateDescription('');
    setTemplateTags([]);
  };

  // 处理复制操作
  const handleCopy = (content: string, format: 'markdown' | 'json') => {
    console.log(`复制${format}格式内容:`, content);
  };

  // 处理导出操作
  const handleExport = (content: string, format: 'markdown' | 'json') => {
    console.log(`导出${format}格式文件:`, content);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* 页面标题 */}
        <div className='text-center mb-8'>
          <Title level={1} className='!mb-4'>
            智能提示词生成器
          </Title>
          <Paragraph className='text-lg text-gray-600 max-w-2xl mx-auto'>
            基于上下文工程六要素理论，通过结构化输入快速生成专业的 AI 提示词模板
          </Paragraph>
        </div>

        {/* 主要内容区域 */}
        <Row gutter={[24, 24]} className='min-h-96'>
          {/* 左侧：模板信息和六要素表单 */}
          <Col xs={24} lg={14}>
            <div className='space-y-6'>
              {/* 模板信息 */}
              <TemplateMetadata
                onNameChange={setTemplateName}
                onDescriptionChange={setTemplateDescription}
                onTagsChange={setTemplateTags}
                initialName={templateName}
                initialDescription={templateDescription}
                initialTags={templateTags}
              />
              
              {/* 六要素表单 */}
              <Card className='shadow-sm'>
                <SixElementsForm
                  initialValues={currentElements}
                  onChange={handleElementsChange}
                  onSubmit={handleSubmit}
                />
              </Card>
            </div>
          </Col>

          {/* 右侧：实时预览 */}
          <Col xs={24} lg={10}>
            <div className='sticky top-6'>
              <PromptPreview
                elements={currentElements}
                onSave={handleSaveTemplate}
                onCopy={handleCopy}
                onExport={handleExport}
              />
            </div>
          </Col>
        </Row>

        {/* 使用说明 */}
        <Card className='mt-8 bg-blue-50 border-blue-200'>
          <Title level={4} className='!text-blue-800 !mb-4'>
            💡 使用说明
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className='text-center'>
                <div className='text-2xl mb-2'>📝</div>
                <div className='font-medium text-blue-800'>填写要素</div>
                <div className='text-sm text-blue-600'>按顺序填写六个核心要素</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className='text-center'>
                <div className='text-2xl mb-2'>👀</div>
                <div className='font-medium text-blue-800'>实时预览</div>
                <div className='text-sm text-blue-600'>右侧实时显示生成效果</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className='text-center'>
                <div className='text-2xl mb-2'>📋</div>
                <div className='font-medium text-blue-800'>复制使用</div>
                <div className='text-sm text-blue-600'>支持多种格式复制导出</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className='text-center'>
                <div className='text-2xl mb-2'>💾</div>
                <div className='font-medium text-blue-800'>保存模板</div>
                <div className='text-sm text-blue-600'>保存到个人模板库复用</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default GeneratorPage;