import React from 'react';
import { Select, Tag, Space } from 'antd';
import { UserOutlined, BulbOutlined } from '@ant-design/icons';

const { Option } = Select;

interface RoleSuggestionsProps {
  type: 'ai' | 'user';
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const RoleSuggestions: React.FC<RoleSuggestionsProps> = ({
  type,
  value,
  onChange,
  placeholder
}) => {
  // AI角色建议
  const aiRoles = [
    { value: '专业顾问', label: '专业顾问', description: '具有丰富经验的行业专家' },
    { value: '技术专家', label: '技术专家', description: '精通技术领域的资深工程师' },
    { value: '创意助手', label: '创意助手', description: '富有创造力的内容创作者' },
    { value: '分析师', label: '分析师', description: '数据分析和洞察专家' },
    { value: '教育导师', label: '教育导师', description: '经验丰富的教学专家' },
    { value: '产品经理', label: '产品经理', description: '产品策划和管理专家' },
    { value: '营销专家', label: '营销专家', description: '市场营销和推广专家' },
    { value: '设计师', label: '设计师', description: '用户体验和视觉设计专家' }
  ];

  // 用户角色建议
  const userRoles = [
    { value: '初学者', label: '初学者', description: '刚接触该领域的新手' },
    { value: '学生', label: '学生', description: '正在学习相关知识的学生' },
    { value: '从业者', label: '从业者', description: '有一定经验的行业从业者' },
    { value: '管理者', label: '管理者', description: '负责团队管理的领导者' },
    { value: '创业者', label: '创业者', description: '正在创业或准备创业的人' },
    { value: '研究者', label: '研究者', description: '从事学术或行业研究的人员' },
    { value: '决策者', label: '决策者', description: '需要做出重要决策的高管' },
    { value: '用户', label: '普通用户', description: '产品或服务的最终用户' }
  ];

  const suggestions = type === 'ai' ? aiRoles : userRoles;
  const icon = type === 'ai' ? <BulbOutlined /> : <UserOutlined />;

  const handleSelect = (selectedValue: string) => {
    const selected = suggestions.find(item => item.value === selectedValue);
    if (selected) {
      const roleText = `你是一位${selected.label}，${selected.description}`;
      onChange?.(type === 'ai' ? roleText : `我是一名${selected.label}，${selected.description}`);
    }
  };

  const handleQuickSelect = (roleValue: string) => {
    handleSelect(roleValue);
  };

  return (
    <div className='space-y-3'>
      {/* 下拉选择 */}
      <Select
        placeholder={placeholder || `选择${type === 'ai' ? 'AI' : '用户'}角色模板`}
        style={{ width: '100%' }}
        onSelect={handleSelect}
        allowClear
        showSearch
        filterOption={(input, option) =>
          option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
        }
      >
        {suggestions.map(role => (
          <Option key={role.value} value={role.value}>
            <div className='flex items-center justify-between'>
              <span>{role.label}</span>
              <span className='text-xs text-gray-400'>{role.description}</span>
            </div>
          </Option>
        ))}
      </Select>

      {/* 快速选择标签 */}
      <div>
        <div className='text-xs text-gray-500 mb-2 flex items-center'>
          {icon}
          <span className='ml-1'>快速选择：</span>
        </div>
        <Space size={[8, 8]} wrap>
          {suggestions.slice(0, 6).map(role => (
            <Tag
              key={role.value}
              className='cursor-pointer hover:bg-blue-50 hover:border-blue-300'
              onClick={() => handleQuickSelect(role.value)}
            >
              {role.label}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default RoleSuggestions;