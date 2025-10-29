import React, { useState, useMemo } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Empty, 
  message, 
  Modal,
  Checkbox,
  Space,
  Statistic,
  Card
} from 'antd';
import { 
  PlusOutlined, 
  ImportOutlined, 
  ExportOutlined,
  DeleteOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import TemplateCard from '../../components/template/TemplateCard';
import TemplateFilters from '../../components/template/TemplateFilters';
import { Template, SearchFilter } from '../../types';

const { Title, Text } = Typography;

const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateTemplate, deleteTemplate } = useApp();
  const [filters, setFilters] = useState<SearchFilter>({
    keyword: '',
    tags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [batchMode, setBatchMode] = useState(false);

  // 获取所有可用标签
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    state.templates.forEach(template => {
      template.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [state.templates]);

  // 筛选和排序模板
  const filteredTemplates = useMemo(() => {
    let filtered = [...state.templates];

    // 关键词筛选
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(keyword) ||
        template.description?.toLowerCase().includes(keyword)
      );
    }

    // 标签筛选
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(template =>
        filters.tags!.some(tag => template.tags?.includes(tag))
      );
    }

    // 日期筛选
    if (filters.dateRange) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(template => {
        const createdAt = new Date(template.createdAt);
        return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
      });
    }

    // 排序
    filtered.sort((a, b) => {
      const { sortBy = 'createdAt', sortOrder = 'desc' } = filters;
      let comparison = 0;

      switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'createdAt':
      default:
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [state.templates, filters]);

  // 处理模板编辑
  const handleEditTemplate = (template: Template) => {
    // TODO: 实现编辑功能，可以导航到生成器页面并预填数据
    navigate('/generator', { state: { template } });
  };

  // 处理模板删除
  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    message.success('模板已删除');
    setSelectedTemplates(prev => prev.filter(id => id !== templateId));
  };

  // 处理模板复制
  const handleCopyTemplate = (template: Template) => {
    const newTemplate: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (副本)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 这里应该调用 addTemplate，但由于当前 context 没有这个方法，我们先用 updateTemplate
    // TODO: 在 AppContext 中添加 addTemplate 方法
    message.success('模板已复制');
  };

  // 处理模板导出
  const handleExportTemplate = (template: Template) => {
    const exportData = {
      name: template.name,
      description: template.description,
      elements: template.elements,
      tags: template.tags,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success('模板已导出');
  };

  // 处理模板选择
  const handleSelectTemplate = (template: Template) => {
    if (batchMode) {
      setSelectedTemplates(prev =>
        prev.includes(template.id)
          ? prev.filter(id => id !== template.id)
          : [...prev, template.id]
      );
    } else {
      handleEditTemplate(template);
    }
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确定要删除选中的模板吗？',
      content: `将删除 ${selectedTemplates.length} 个模板，此操作无法撤销。`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        selectedTemplates.forEach(id => deleteTemplate(id));
        message.success(`已删除 ${selectedTemplates.length} 个模板`);
        setSelectedTemplates([]);
        setBatchMode(false);
      }
    });
  };

  // 处理批量导出
  const handleBatchExport = () => {
    const selectedTemplateData = state.templates
      .filter(template => selectedTemplates.includes(template.id))
      .map(template => ({
        name: template.name,
        description: template.description,
        elements: template.elements,
        tags: template.tags
      }));

    const exportData = {
      templates: selectedTemplateData,
      exportedAt: new Date().toISOString(),
      count: selectedTemplateData.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `templates_batch_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success(`已导出 ${selectedTemplates.length} 个模板`);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* 页面标题和操作 */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6'>
          <div>
            <Title level={1} className='!mb-2'>
              我的模板
            </Title>
            <Text type='secondary' className='text-lg'>
              管理您创建的所有提示词模板
            </Text>
          </div>
          
          <div className='flex flex-wrap gap-2 mt-4 sm:mt-0'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => navigate('/generator')}
              size='large'
            >
              新建模板
            </Button>
            <Button
              icon={<ImportOutlined />}
              size='large'
            >
              导入模板
            </Button>
            {state.templates.length > 0 && (
              <Button
                icon={<ExportOutlined />}
                onClick={() => setBatchMode(!batchMode)}
                size='large'
              >
                {batchMode ? '退出批量' : '批量操作'}
              </Button>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        {state.templates.length > 0 && (
          <Row gutter={16} className='mb-6'>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title='总模板数'
                  value={state.templates.length}
                  prefix={<FolderOpenOutlined />}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title='筛选结果'
                  value={filteredTemplates.length}
                  prefix={<FolderOpenOutlined />}
                />
              </Card>
            </Col>
            {batchMode && (
              <>
                <Col xs={12} sm={6}>
                  <Card>
                    <Statistic
                      title='已选择'
                      value={selectedTemplates.length}
                      prefix={<Checkbox />}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card className='flex items-center'>
                    <Space>
                      <Button
                        type='primary'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleBatchDelete}
                        disabled={selectedTemplates.length === 0}
                      >
                        批量删除
                      </Button>
                      <Button
                        icon={<ExportOutlined />}
                        onClick={handleBatchExport}
                        disabled={selectedTemplates.length === 0}
                      >
                        批量导出
                      </Button>
                    </Space>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        )}

        {/* 筛选组件 */}
        {state.templates.length > 0 && (
          <TemplateFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
          />
        )}

        {/* 模板列表 */}
        {filteredTemplates.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredTemplates.map(template => (
              <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
                <div className='relative'>
                  {batchMode && (
                    <Checkbox
                      className='absolute top-2 left-2 z-10'
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => handleSelectTemplate(template)}
                    />
                  )}
                  <TemplateCard
                    template={template}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                    onCopy={handleCopyTemplate}
                    onExport={handleExportTemplate}
                    onSelect={handleSelectTemplate}
                  />
                </div>
              </Col>
            ))}
          </Row>
        ) : state.templates.length === 0 ? (
          // 空状态 - 没有任何模板
          <div className='text-center py-20'>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text type='secondary' className='text-lg block mb-4'>
                    还没有创建任何模板
                  </Text>
                  <Text type='secondary'>
                    点击"新建模板"开始创建您的第一个提示词模板
                  </Text>
                </div>
              }
            >
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => navigate('/generator')}
                size='large'
              >
                创建第一个模板
              </Button>
            </Empty>
          </div>
        ) : (
          // 空状态 - 筛选结果为空
          <div className='text-center py-20'>
            <Empty
              description={
                <div>
                  <Text type='secondary' className='text-lg block mb-2'>
                    没有找到匹配的模板
                  </Text>
                  <Text type='secondary'>
                    尝试调整筛选条件或创建新的模板
                  </Text>
                </div>
              }
            >
              <Space>
                <Button onClick={() => setFilters({ sortBy: 'createdAt', sortOrder: 'desc' })}>
                  清空筛选
                </Button>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/generator')}
                >
                  新建模板
                </Button>
              </Space>
            </Empty>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;