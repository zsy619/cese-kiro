import React from 'react';
import { Form, Input, Card, Typography, Space, Tag, Select } from 'antd';
import { FileTextOutlined, TagsOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface TemplateMetadataProps {
  onNameChange?: (name: string) => void;
  onDescriptionChange?: (description: string) => void;
  onTagsChange?: (tags: string[]) => void;
  initialName?: string;
  initialDescription?: string;
  initialTags?: string[];
}

const TemplateMetadata: React.FC<TemplateMetadataProps> = ({
  onNameChange,
  onDescriptionChange,
  onTagsChange,
  initialName = '',
  initialDescription = '',
  initialTags = []
}) => {
  // 预设标签
  const presetTags = [
    '工作', '学习', '创作', '分析', '规划', '总结',
    '技术', '商业', '教育', '营销', '设计', '研究',
    '产品', '管理', '咨询', '培训', '写作', '翻译'
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange?.(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDescriptionChange?.(e.target.value);
  };

  const handleTagsChange = (tags: string[]) => {
    onTagsChange?.(tags);
  };

  return (
    <Card 
      className='mb-6 shadow-sm'
      title={
        <div className='flex items-center'>
          <FileTextOutlined className='mr-2 text-blue-500' />
          <Title level={4} className='!mb-0'>
            模板信息
          </Title>
        </div>
      }
    >
      <Space direction='vertical' size='large' className='w-full'>
        {/* 模板名称 */}
        <div>
          <div className='flex items-center mb-2'>
            <Text strong>模板名称</Text>
            <Text type='danger' className='ml-1'>*</Text>
            <InfoCircleOutlined 
              className='ml-2 text-gray-400 cursor-help' 
              title='为您的提示词模板起一个有意义的名称'
            />
          </div>
          <Input
            placeholder='请输入模板名称，如：技术文章写作助手'
            value={initialName}
            onChange={handleNameChange}
            maxLength={50}
            showCount
            size='large'
          />
        </div>

        {/* 模板描述 */}
        <div>
          <div className='flex items-center mb-2'>
            <Text strong>模板描述</Text>
            <Text type='secondary' className='ml-2 text-sm'>（可选）</Text>
            <InfoCircleOutlined 
              className='ml-2 text-gray-400 cursor-help' 
              title='简要描述这个模板的用途和特点'
            />
          </div>
          <TextArea
            placeholder='请简要描述模板的用途和适用场景...'
            value={initialDescription}
            onChange={handleDescriptionChange}
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={200}
            showCount
          />
        </div>

        {/* 标签选择 */}
        <div>
          <div className='flex items-center mb-2'>
            <TagsOutlined className='mr-1 text-orange-500' />
            <Text strong>标签分类</Text>
            <Text type='secondary' className='ml-2 text-sm'>（可选）</Text>
            <InfoCircleOutlined 
              className='ml-2 text-gray-400 cursor-help' 
              title='添加标签便于分类和搜索'
            />
          </div>
          
          <Select
            mode='tags'
            placeholder='选择或输入标签'
            value={initialTags}
            onChange={handleTagsChange}
            style={{ width: '100%' }}
            maxTagCount={5}
            tokenSeparators={[',', ' ']}
          >
            {presetTags.map(tag => (
              <Select.Option key={tag} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>
          
          <div className='mt-2'>
            <Text type='secondary' className='text-xs'>
              常用标签：
            </Text>
            <div className='mt-1'>
              <Space size={[4, 4]} wrap>
                {presetTags.slice(0, 8).map(tag => (
                  <Tag
                    key={tag}
                    className='cursor-pointer hover:bg-blue-50 hover:border-blue-300'
                    onClick={() => {
                      const newTags = initialTags.includes(tag) 
                        ? initialTags.filter(t => t !== tag)
                        : [...initialTags, tag];
                      handleTagsChange(newTags);
                    }}
                    color={initialTags.includes(tag) ? 'blue' : undefined}
                  >
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default TemplateMetadata;