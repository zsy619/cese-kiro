import React, { useState, useEffect } from 'react';
import { Form, Input, Card, Typography, Space, Button, Tooltip, Row, Col, Collapse } from 'antd';
import { 
  InfoCircleOutlined, 
  RocketOutlined, 
  UserOutlined, 
  BulbOutlined,
  FileTextOutlined,
  HeartOutlined,
  CloudDownloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { SixElements } from '../../types';
import RoleSuggestions from './RoleSuggestions';
import FormatTemplates from './FormatTemplates';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface SixElementsFormProps {
  initialValues?: Partial<SixElements>;
  onChange?: (values: SixElements) => void;
  onSubmit?: (values: SixElements) => void;
  loading?: boolean;
}

const SixElementsForm: React.FC<SixElementsFormProps> = ({
  initialValues,
  onChange,
  onSubmit,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState<Partial<SixElements>>(initialValues || {});

  // 六要素配置
  const elementsConfig = [
    {
      key: 'taskGoal',
      title: '任务目标',
      icon: <RocketOutlined className='text-blue-500' />,
      placeholder: '请描述要完成的具体任务...',
      tooltip: '明确说明希望AI帮助完成的具体任务或目标',
      example: '例如：帮我写一篇关于人工智能发展趋势的技术文章'
    },
    {
      key: 'aiRole',
      title: 'AI的角色',
      icon: <BulbOutlined className='text-green-500' />,
      placeholder: '请定义AI扮演的专业角色...',
      tooltip: '设定AI的专业身份，如专家、顾问、助手等',
      example: '例如：你是一位有10年经验的人工智能技术专家和科技作家'
    },
    {
      key: 'userRole',
      title: '我的角色',
      icon: <UserOutlined className='text-purple-500' />,
      placeholder: '请说明您的身份和立场...',
      tooltip: '描述您的身份、背景或在此任务中的角色',
      example: '例如：我是一名对AI技术感兴趣的产品经理'
    },
    {
      key: 'keyInfo',
      title: '关键信息',
      icon: <FileTextOutlined className='text-orange-500' />,
      placeholder: '请提供任务相关的核心信息和约束条件...',
      tooltip: '列出完成任务所需的重要背景信息、限制条件等',
      example: '例如：文章字数3000字左右，面向技术管理者，需要包含实际案例'
    },
    {
      key: 'behaviorRules',
      title: '行为规则',
      icon: <HeartOutlined className='text-red-500' />,
      placeholder: '请规定AI的行为准则和输出要求...',
      tooltip: '设定AI的行为准则、输出风格、注意事项等',
      example: '例如：语言要专业但易懂，避免过于技术化的术语，保持客观中立的态度'
    },
    {
      key: 'deliveryFormat',
      title: '交付格式',
      icon: <CloudDownloadOutlined className='text-cyan-500' />,
      placeholder: '请明确最终输出的格式和结构...',
      tooltip: '指定输出的具体格式、结构、长度等要求',
      example: '例如：Markdown格式，包含标题、摘要、正文（分3个部分）、结论'
    }
  ];

  // 处理表单值变化
  const handleValuesChange = (changedValues: any, allValues: SixElements) => {
    setFormValues(allValues);
    onChange?.(allValues);
  };

  // 处理表单提交
  const handleSubmit = (values: SixElements) => {
    onSubmit?.(values);
  };

  // 获取字数统计
  const getWordCount = (text: string) => {
    return text ? text.length : 0;
  };

  // 验证规则
  const getValidationRules = (required = true) => [
    {
      required,
      message: '此项为必填项'
    },
    {
      min: 10,
      message: '内容不能少于10个字符'
    }
  ];

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setFormValues(initialValues);
    }
  }, [initialValues, form]);

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-8 text-center'>
        <Title level={2} className='!mb-2'>
          六要素提示词构建
        </Title>
        <Text type='secondary' className='text-lg'>
          按照以下六个要素填写信息，系统将自动生成专业的提示词模板
        </Text>
      </div>

      <Form
        form={form}
        layout='vertical'
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
        initialValues={initialValues}
        size='large'
      >
        <Row gutter={[0, 24]}>
          {elementsConfig.map((element, index) => (
            <Col span={24} key={element.key}>
              <Card 
                className='shadow-sm hover:shadow-md transition-shadow duration-200'
                bodyStyle={{ padding: '24px' }}
              >
                <div className='flex items-center mb-4'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50 mr-3'>
                    {element.icon}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                      <Title level={4} className='!mb-0'>
                        {index + 1}. {element.title}
                      </Title>
                      <Tooltip title={element.tooltip} placement='top'>
                        <InfoCircleOutlined className='text-gray-400 cursor-help' />
                      </Tooltip>
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>
                    {getWordCount(formValues[element.key as keyof SixElements] || '')} 字
                  </div>
                </div>

                <Form.Item
                  name={element.key}
                  rules={getValidationRules()}
                  className='!mb-2'
                >
                  <TextArea
                    placeholder={element.placeholder}
                    autoSize={{ minRows: 3, maxRows: 8 }}
                    showCount
                    className='resize-none'
                  />
                </Form.Item>

                {/* 角色建议和格式模板 */}
                {(element.key === 'aiRole' || element.key === 'userRole' || element.key === 'deliveryFormat') && (
                  <Collapse ghost className='mb-2'>
                    <Panel 
                      header={
                        <Text type='secondary' className='text-xs flex items-center'>
                          <SettingOutlined className='mr-1' />
                          {element.key === 'aiRole' ? 'AI角色建议' : 
                           element.key === 'userRole' ? '用户角色建议' : '格式模板'}
                        </Text>
                      } 
                      key='1'
                      className='!border-none'
                    >
                      {element.key === 'aiRole' && (
                        <RoleSuggestions
                          type='ai'
                          onChange={(value) => {
                            form.setFieldValue('aiRole', value);
                            setFormValues(prev => ({ ...prev, aiRole: value }));
                            onChange?.({ ...formValues, aiRole: value } as SixElements);
                          }}
                        />
                      )}
                      {element.key === 'userRole' && (
                        <RoleSuggestions
                          type='user'
                          onChange={(value) => {
                            form.setFieldValue('userRole', value);
                            setFormValues(prev => ({ ...prev, userRole: value }));
                            onChange?.({ ...formValues, userRole: value } as SixElements);
                          }}
                        />
                      )}
                      {element.key === 'deliveryFormat' && (
                        <FormatTemplates
                          onChange={(value) => {
                            form.setFieldValue('deliveryFormat', value);
                            setFormValues(prev => ({ ...prev, deliveryFormat: value }));
                            onChange?.({ ...formValues, deliveryFormat: value } as SixElements);
                          }}
                        />
                      )}
                    </Panel>
                  </Collapse>
                )}

                <div className='text-xs text-gray-400 mt-2'>
                  <Text type='secondary'>
                    💡 {element.example}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className='mt-8 text-center'>
          <Space size='large'>
            <Button 
              type='default' 
              size='large'
              onClick={() => form.resetFields()}
            >
              重置表单
            </Button>
            <Button 
              type='primary' 
              size='large'
              htmlType='submit'
              loading={loading}
              className='px-8'
            >
              生成提示词
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default SixElementsForm;