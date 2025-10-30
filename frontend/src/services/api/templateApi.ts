import { message } from 'antd';
import { get, post, put, del, download } from '../../utils/request';
import { API_ENDPOINTS } from '../../config/api';
import type { Template, SearchFilter, Pagination } from '../../types';

/**
 * 模板 API 服务
 */
export const templateApi = {
  /**
   * 获取模板列表
   */
  getList: async (params?: {
    page?: number;
    pageSize?: number;
    keyword?: string;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ list: Template[]; total: number; pagination: Pagination }> => {
    try {
      const response = await get<{ list: Template[]; total: number }>(
        API_ENDPOINTS.TEMPLATE.LIST,
        params
      );
      
      if (response.success && response.data) {
        return {
          list: response.data.list,
          total: response.data.total,
          pagination: {
            current: params?.page || 1,
            pageSize: params?.pageSize || 10,
            total: response.data.total
          }
        };
      }
      
      throw new Error('获取模板列表失败');
    } catch (error) {
      console.warn('使用本地模板数据');
      // 从本地存储获取
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      
      return {
        list: templates,
        total: templates.length,
        pagination: {
          current: 1,
          pageSize: 10,
          total: templates.length
        }
      };
    }
  },

  /**
   * 获取模板详情
   */
  getDetail: async (id: string): Promise<Template> => {
    try {
      const response = await get<Template>(API_ENDPOINTS.TEMPLATE.DETAIL(id));
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('获取模板详情失败');
    } catch (error) {
      // 从本地存储获取
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      const template = templates.find(t => t.id === id);
      
      if (!template) {
        throw new Error('模板不存在');
      }
      
      return template;
    }
  },

  /**
   * 创建模板
   */
  create: async (data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> => {
    try {
      const response = await post<Template>(API_ENDPOINTS.TEMPLATE.CREATE, data);
      
      if (response.success && response.data) {
        message.success('模板创建成功');
        return response.data;
      }
      
      throw new Error('创建模板失败');
    } catch (error) {
      console.warn('使用本地存储创建模板');
      // 保存到本地存储
      const newTemplate: Template = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      templates.push(newTemplate);
      localStorage.setItem('templates', JSON.stringify(templates));
      
      message.success('模板创建成功（本地）');
      return newTemplate;
    }
  },

  /**
   * 更新模板
   */
  update: async (id: string, data: Partial<Template>): Promise<Template> => {
    try {
      const response = await put<Template>(API_ENDPOINTS.TEMPLATE.UPDATE(id), data);
      
      if (response.success && response.data) {
        message.success('模板更新成功');
        return response.data;
      }
      
      throw new Error('更新模板失败');
    } catch (error) {
      console.warn('使用本地存储更新模板');
      // 更新本地存储
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      const index = templates.findIndex(t => t.id === id);
      
      if (index === -1) {
        throw new Error('模板不存在');
      }
      
      templates[index] = {
        ...templates[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('templates', JSON.stringify(templates));
      
      message.success('模板更新成功（本地）');
      return templates[index];
    }
  },

  /**
   * 删除模板
   */
  delete: async (id: string): Promise<void> => {
    try {
      await del(API_ENDPOINTS.TEMPLATE.DELETE(id));
      message.success('模板删除成功');
    } catch (error) {
      console.warn('使用本地存储删除模板');
      // 从本地存储删除
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      const filtered = templates.filter(t => t.id !== id);
      localStorage.setItem('templates', JSON.stringify(filtered));
      
      message.success('模板删除成功（本地）');
    }
  },

  /**
   * 批量删除模板
   */
  batchDelete: async (ids: string[]): Promise<void> => {
    try {
      await post(API_ENDPOINTS.TEMPLATE.BATCH_DELETE, { ids });
      message.success(`成功删除 ${ids.length} 个模板`);
    } catch (error) {
      console.warn('使用本地存储批量删除模板');
      // 从本地存储批量删除
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      const filtered = templates.filter(t => !ids.includes(t.id));
      localStorage.setItem('templates', JSON.stringify(filtered));
      
      message.success(`成功删除 ${ids.length} 个模板（本地）`);
    }
  },

  /**
   * 搜索模板
   */
  search: async (filter: SearchFilter): Promise<Template[]> => {
    try {
      const response = await post<Template[]>(API_ENDPOINTS.TEMPLATE.SEARCH, filter);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('搜索失败');
    } catch (error) {
      // 本地搜索
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      
      return templates.filter(template => {
        // 关键词搜索
        if (filter.keyword) {
          const keyword = filter.keyword.toLowerCase();
          const matchName = template.name.toLowerCase().includes(keyword);
          const matchDesc = template.description?.toLowerCase().includes(keyword);
          if (!matchName && !matchDesc) return false;
        }
        
        // 标签筛选
        if (filter.tags && filter.tags.length > 0) {
          const hasTag = filter.tags.some(tag => template.tags.includes(tag));
          if (!hasTag) return false;
        }
        
        return true;
      });
    }
  },

  /**
   * 导出模板
   */
  export: async (ids: string[], format: 'json' | 'markdown' = 'json'): Promise<void> => {
    try {
      await download(
        API_ENDPOINTS.TEMPLATE.EXPORT,
        `templates-${Date.now()}.${format}`,
        { ids, format }
      );
    } catch (error) {
      console.warn('使用本地数据导出');
      // 本地导出
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      const exportData = templates.filter(t => ids.includes(t.id));
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `templates-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('导出成功');
    }
  },

  /**
   * 导入模板
   */
  import: async (file: File): Promise<Template[]> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await post<Template[]>(API_ENDPOINTS.TEMPLATE.IMPORT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.success && response.data) {
        message.success(`成功导入 ${response.data.length} 个模板`);
        return response.data;
      }
      
      throw new Error('导入失败');
    } catch (error) {
      console.warn('使用本地导入');
      // 本地导入
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const importedTemplates: Template[] = JSON.parse(content);
            
            // 保存到本地存储
            const localTemplates = localStorage.getItem('templates');
            const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
            
            // 添加导入的模板
            const newTemplates = importedTemplates.map(t => ({
              ...t,
              id: Date.now().toString() + Math.random(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }));
            
            templates.push(...newTemplates);
            localStorage.setItem('templates', JSON.stringify(templates));
            
            message.success(`成功导入 ${newTemplates.length} 个模板（本地）`);
            resolve(newTemplates);
          } catch (error) {
            message.error('导入失败：文件格式错误');
            reject(error);
          }
        };
        reader.onerror = () => {
          message.error('导入失败：文件读取错误');
          reject(new Error('文件读取错误'));
        };
        reader.readAsText(file);
      });
    }
  },

  /**
   * 获取标签列表
   */
  getTags: async (): Promise<string[]> => {
    try {
      const response = await get<string[]>(API_ENDPOINTS.TEMPLATE.TAGS);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('获取标签失败');
    } catch (error) {
      // 从本地模板提取标签
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      const tags = new Set<string>();
      
      templates.forEach(template => {
        template.tags.forEach(tag => tags.add(tag));
      });
      
      return Array.from(tags);
    }
  },

  /**
   * 获取统计信息
   */
  getStatistics: async (): Promise<{
    total: number;
    public: number;
    private: number;
    tags: Record<string, number>;
  }> => {
    try {
      const response = await get(API_ENDPOINTS.TEMPLATE.STATISTICS);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error('获取统计信息失败');
    } catch (error) {
      // 本地统计
      const localTemplates = localStorage.getItem('templates');
      const templates: Template[] = localTemplates ? JSON.parse(localTemplates) : [];
      
      const tags: Record<string, number> = {};
      templates.forEach(template => {
        template.tags.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      });
      
      return {
        total: templates.length,
        public: templates.filter(t => t.isPublic).length,
        private: templates.filter(t => !t.isPublic).length,
        tags
      };
    }
  }
};