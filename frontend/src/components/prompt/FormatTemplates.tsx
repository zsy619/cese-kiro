import React from 'react';
import { Select, Tag, Space, Tooltip } from 'antd';
import { 
  FileTextOutlined, 
  TableOutlined, 
  OrderedListOutlined,
  BulbOutlined,
  CodeOutlined,
  FileMarkdownOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface FormatTemplatesProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const FormatTemplates: React.FC<FormatTemplatesProps> = ({
  value,
  onChange,
  placeholder
}) => {
  // 格式模板定义
  const formatTemplates = [
    {
      key: 'markdown',
      label: 'Markdown 文档',
      icon: <FileMarkdownOutlined />,
      description: '标准 Markdown 格式文档',
      template: `请按照以下 Markdown 格式输出：

# 标题

## 主要内容

### 子标题

- 要点1
- 要点2
- 要点3

**重点内容**使用粗体标记
*强调内容*使用斜体标记

\`\`\`
代码块使用三个反引号包围
\`\`\`

> 引用内容使用 > 符号`
    },
    {
      key: 'structured',
      label: '结构化列表',
      icon: <OrderedListOutlined />,
      description: '有序的结构化内容',
      template: `请按照以下结构化格式输出：

1. 第一部分
   - 详细说明1
   - 详细说明2
   
2. 第二部分
   - 详细说明1
   - 详细说明2
   
3. 第三部分
   - 详细说明1
   - 详细说明2

总结：
- 关键要点总结`
    },
    {
      key: 'table',
      label: '表格格式',
      icon: <TableOutlined />,
      description: '表格形式展示数据',
      template: `请按照以下表格格式输出：

| 项目 | 描述 | 备注 |
|------|------|------|
| 项目1 | 详细描述1 | 相关备注1 |
| 项目2 | 详细描述2 | 相关备注2 |
| 项目3 | 详细描述3 | 相关备注3 |

说明：
- 表格包含项目、描述、备注三列
- 每行对应一个具体项目`
    },
    {
      key: 'json',
      label: 'JSON 格式',
      icon: <CodeOutlined />,
      description: '结构化 JSON 数据格式',
      template: `请按照以下 JSON 格式输出：

\`\`\`json
{
  "title": "标题",
  "content": {
    "summary": "内容摘要",
    "details": [
      {
        "section": "章节1",
        "points": ["要点1", "要点2"]
      },
      {
        "section": "章节2", 
        "points": ["要点1", "要点2"]
      }
    ]
  },
  "conclusion": "结论总结"
}
\`\`\``
    },
    {
      key: 'article',
      label: '文章格式',
      icon: <FileTextOutlined />,
      description: '标准文章结构',
      template: `请按照以下文章格式输出：

# 文章标题

## 摘要
简要概述文章主要内容和观点

## 引言
介绍背景和问题

## 正文
### 第一部分
详细阐述第一个要点

### 第二部分  
详细阐述第二个要点

### 第三部分
详细阐述第三个要点

## 结论
总结主要观点和建议

## 参考资料
相关资料和来源`
    },
    {
      key: 'qa',
      label: 'Q&A 问答',
      icon: <BulbOutlined />,
      description: '问答形式的内容',
      template: `请按照以下问答格式输出：

**Q1: 问题1？**
A1: 详细回答问题1的内容...

**Q2: 问题2？**  
A2: 详细回答问题2的内容...

**Q3: 问题3？**
A3: 详细回答问题3的内容...

**总结：**
对所有问答内容的总结和要点提炼`
    }
  ];

  const handleSelect = (selectedKey: string) => {
    const selected = formatTemplates.find(item => item.key === selectedKey);
    if (selected) {
      onChange?.(selected.template);
    }
  };

  const handleQuickSelect = (templateKey: string) => {
    handleSelect(templateKey);
  };

  return (
    <div className='space-y-3'>
      {/* 下拉选择 */}
      <Select
        placeholder={placeholder || '选择输出格式模板'}
        style={{ width: '100%' }}
        onSelect={handleSelect}
        allowClear
        showSearch
        filterOption={(input, option) =>
          option?.label?.toString().toLowerCase().includes(input.toLowerCase()) || false
        }
      >
        {formatTemplates.map(template => (
          <Option key={template.key} value={template.key}>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='mr-2'>{template.icon}</span>
                <span>{template.label}</span>
              </div>
              <span className='text-xs text-gray-400'>{template.description}</span>
            </div>
          </Option>
        ))}
      </Select>

      {/* 快速选择标签 */}
      <div>
        <div className='text-xs text-gray-500 mb-2 flex items-center'>
          <FileTextOutlined />
          <span className='ml-1'>快速选择：</span>
        </div>
        <Space size={[8, 8]} wrap>
          {formatTemplates.map(template => (
            <Tooltip key={template.key} title={template.description}>
              <Tag
                className='cursor-pointer hover:bg-blue-50 hover:border-blue-300 flex items-center'
                onClick={() => handleQuickSelect(template.key)}
              >
                <span className='mr-1'>{template.icon}</span>
                {template.label}
              </Tag>
            </Tooltip>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default FormatTemplates;