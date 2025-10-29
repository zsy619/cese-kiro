import React from 'react';
import { Input, Select, Space, Button, Tag, DatePicker, Card } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ClearOutlined,
    TagsOutlined,
    CalendarOutlined,
    SortAscendingOutlined
} from '@ant-design/icons';
import { SearchFilter } from '../../types';

const { RangePicker } = DatePicker;

interface TemplateFiltersProps {
    filters: SearchFilter;
    onFiltersChange: (filters: SearchFilter) => void;
    availableTags: string[];
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({
    filters,
    onFiltersChange,
    availableTags
}) => {
    // 处理搜索关键词变化
    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({
            ...filters,
            keyword: e.target.value
        });
    };

    // 处理标签筛选变化
    const handleTagsChange = (tags: string[]) => {
        onFiltersChange({
            ...filters,
            tags
        });
    };

    // 处理日期范围变化
    const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        onFiltersChange({
            ...filters,
            dateRange: dateStrings[0] && dateStrings[1] ? dateStrings : undefined
        });
    };

    // 处理排序变化
    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-');
        onFiltersChange({
            ...filters,
            sortBy: sortBy as 'createdAt' | 'updatedAt' | 'name',
            sortOrder: sortOrder as 'asc' | 'desc'
        });
    };

    // 清空所有筛选条件
    const handleClearFilters = () => {
        onFiltersChange({
            keyword: '',
            tags: [],
            dateRange: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    // 检查是否有活动的筛选条件
    const hasActiveFilters = !!(
        filters.keyword ||
        (filters.tags && filters.tags.length > 0) ||
        filters.dateRange
    );

    return (
        <Card className='mb-6 shadow-sm'>
            <div className='space-y-4'>
                {/* 第一行：搜索框和排序 */}
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1'>
                        <Input
                            placeholder='搜索模板名称或描述...'
                            prefix={<SearchOutlined className='text-gray-400' />}
                            value={filters.keyword}
                            onChange={handleKeywordChange}
                            allowClear
                            size='large'
                        />
                    </div>

                    <div className='flex gap-2'>
                        <Select
                            placeholder='排序方式'
                            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
                            onChange={handleSortChange}
                            style={{ width: 140 }}
                            size='large'
                            suffixIcon={<SortAscendingOutlined />}
                        >
                            <Select.Option value='createdAt-desc'>最新创建</Select.Option>
                            <Select.Option value='createdAt-asc'>最早创建</Select.Option>
                            <Select.Option value='updatedAt-desc'>最近更新</Select.Option>
                            <Select.Option value='updatedAt-asc'>最早更新</Select.Option>
                            <Select.Option value='name-asc'>名称 A-Z</Select.Option>
                            <Select.Option value='name-desc'>名称 Z-A</Select.Option>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                icon={<ClearOutlined />}
                                onClick={handleClearFilters}
                                size='large'
                            >
                                清空
                            </Button>
                        )}
                    </div>
                </div>

                {/* 第二行：标签筛选和日期筛选 */}
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* 标签筛选 */}
                    <div className='flex-1'>
                        <div className='flex items-center mb-2'>
                            <TagsOutlined className='mr-1 text-gray-500' />
                            <span className='text-sm text-gray-600'>按标签筛选</span>
                        </div>
                        <Select
                            mode='multiple'
                            placeholder='选择标签进行筛选'
                            value={filters.tags}
                            onChange={handleTagsChange}
                            style={{ width: '100%' }}
                            maxTagCount='responsive'
                            allowClear
                        >
                            {availableTags.map(tag => (
                                <Select.Option key={tag} value={tag}>
                                    {tag}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    {/* 日期筛选 */}
                    <div className='lg:w-80'>
                        <div className='flex items-center mb-2'>
                            <CalendarOutlined className='mr-1 text-gray-500' />
                            <span className='text-sm text-gray-600'>按创建日期筛选</span>
                        </div>
                        <RangePicker
                            placeholder={['开始日期', '结束日期']}
                            onChange={handleDateRangeChange}
                            style={{ width: '100%' }}
                            allowClear
                        />
                    </div>
                </div>

                {/* 活动筛选条件显示 */}
                {hasActiveFilters && (
                    <div className='pt-2 border-t border-gray-100'>
                        <div className='flex items-center mb-2'>
                            <FilterOutlined className='mr-1 text-blue-500' />
                            <span className='text-sm text-blue-600'>当前筛选条件</span>
                        </div>
                        <Space size={[8, 8]} wrap>
                            {filters.keyword && (
                                <Tag
                                    closable
                                    onClose={() => handleKeywordChange({ target: { value: '' } } as any)}
                                    color='blue'
                                >
                                    关键词: {filters.keyword}
                                </Tag>
                            )}
                            {filters.tags?.map(tag => (
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => handleTagsChange(filters.tags?.filter(t => t !== tag) || [])}
                                    color='green'
                                >
                                    标签: {tag}
                                </Tag>
                            ))}
                            {filters.dateRange && (
                                <Tag
                                    closable
                                    onClose={() => handleDateRangeChange(null, ['', ''])}
                                    color='orange'
                                >
                                    日期: {filters.dateRange[0]} ~ {filters.dateRange[1]}
                                </Tag>
                            )}
                        </Space>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TemplateFilters;