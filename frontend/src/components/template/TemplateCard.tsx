import React from 'react';
import { Card, Typography, Tag, Space, Button, Dropdown, Tooltip, Popconfirm } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined, 
  MoreOutlined,
  CalendarOutlined,
  TagsOutlined,
  FileTextOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { Template } from '../../types';

const { Title, Text, Paragraph } = Typography;

interface TemplateCardProps {
  template: Template;
  onEdit?: (template: Template) => void;
  onDelete?: (templateId: string) => void;
  onCopy?: (template: Template) => void;
  onExport?: (template: Template) => void;
  onSelect?: (template: Template) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onCopy,
  onExport,
  onSelect
}) => {
  // 计算已填写的要素数量
  const filledElementsCount = Object.values(template.elements).filter(
    value => value && value.trim()
  ).length;

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 获取完成度颜色
  const getCompletionColor = (count: number) => {
    if (count >= 6) return '#52c41a'; // 绿色
    if (count >= 4) return '#faad14'; // 橙色
    return '#ff4d4f'; // 红色
  };

  // 下拉菜单项
  const menuItems = [
    {
      key: 'edit',
      label: '编辑模板',
      icon: <EditOutlined />,
      onClick: () => onEdit?.(template)
    },
    {
      key: 'copy',
      label: '复制模板',
      icon: <CopyOutlined />,
      onClick: () => onCopy?.(template)
    },
    {
      key: 'export',
      label: '导出模板',
      icon: <ExportOutlined />,
      onClick: () => onExport?.(template)
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      label: '删除模板',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete?.(template.id)
    }
  ];

  return (
    <Card
      className='h-full hover:shadow-lg transition-all duration-300 cursor-pointer'
      bodyStyle={{ padding: '20px' }}
      onClick={() => onSelect?.(template)}
      actions={[
        <Tooltip title='编辑模板' key='edit'>
          <Button 
            type='text' 
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(template);
            }}
          />
        </Tooltip>,
        <Tooltip title='复制模板' key='copy'>
          <Button 
            type='text' 
            icon={<CopyOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onCopy?.(template);
            }}
          />
        </Tooltip>,
        <Popconfirm
          title='确定要删除这个模板吗？'
          description='删除后无法恢复，请谨慎操作。'
          onConfirm={(e) => {
            e?.stopPropagation();
            onDelete?.(template.id);
          }}
          okText='确定'
          cancelText='取消'
          key='delete'
        >
          <Button 
            type='text' 
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>,
        <Dropdown
          menu={{ items: menuItems }}
          placement='bottomRight'
          trigger={['click']}
          key='more'
        >
          <Button 
            type='text' 
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ]}
    >
      {/* 模板标题和状态 */}
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1 min-w-0'>
          <Title level={5} className='!mb-1 truncate' title={template.name}>
            {template.name}
          </Title>
          <div className='flex items-center space-x-2 text-xs text-gray-500'>
            <CalendarOutlined />
            <span>{formatDate(template.createdAt)}</span>
          </div>
        </div>
        
        {/* 完成度指示器 */}
        <div className='flex flex-col items-end ml-2'>
          <div 
            className='w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold'
            style={{ backgroundColor: getCompletionColor(filledElementsCount) }}
          >
            {filledElementsCount}
          </div>
          <Text type='secondary' className='text-xs mt-1'>
            {filledElementsCount}/6
          </Text>
        </div>
      </div>

      {/* 模板描述 */}
      {template.description && (
        <Paragraph 
          className='text-sm text-gray-600 !mb-3'
          ellipsis={{ rows: 2, tooltip: template.description }}
        >
          {template.description}
        </Paragraph>
      )}

      {/* 标签 */}
      {template.tags && template.tags.length > 0 && (
        <div className='mb-3'>
          <div className='flex items-center mb-1'>
            <TagsOutlined className='text-xs text-gray-400 mr-1' />
            <Text type='secondary' className='text-xs'>标签</Text>
          </div>
          <Space size={[4, 4]} wrap>
            {template.tags.slice(0, 3).map(tag => (
              <Tag key={tag} color='blue' className='text-xs'>
                {tag}
              </Tag>
            ))}
            {template.tags.length > 3 && (
              <Tag color='default' className='text-xs'>
                +{template.tags.length - 3}
              </Tag>
            )}
          </Space>
        </div>
      )}

      {/* 要素预览 */}
      <div className='space-y-2'>
        <div className='flex items-center mb-2'>
          <FileTextOutlined className='text-xs text-gray-400 mr-1' />
          <Text type='secondary' className='text-xs'>要素预览</Text>
        </div>
        
        {Object.entries(template.elements).map(([key, value]) => {
          const elementNames: Record<string, string> = {
            taskGoal: '任务目标',
            aiRole: 'AI角色',
            userRole: '用户角色',
            keyInfo: '关键信息',
            behaviorRules: '行为规则',
            deliveryFormat: '交付格式'
          };
          
          return (
            <div key={key} className='flex items-center text-xs'>
              <span className='w-16 text-gray-500 flex-shrink-0'>
                {elementNames[key]}:
              </span>
              <div className='flex-1 min-w-0'>
                {value && value.trim() ? (
                  <Text 
                    className='text-gray-700 text-xs'
                    ellipsis={{ tooltip: value }}
                  >
                    {value}
                  </Text>
                ) : (
                  <Text type='secondary' className='text-xs'>
                    未填写
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TemplateCard;