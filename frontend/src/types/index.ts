// 六要素提示词类型定义
export interface SixElements {
    taskGoal: string;        // 任务目标
    aiRole: string;          // AI的角色
    userRole: string;        // 我的角色
    keyInfo: string;         // 关键信息
    behaviorRules: string;   // 行为规则
    deliveryFormat: string;  // 交付格式
}

// 主题/模板类型定义
export interface Template {
    id: string;
    name: string;
    description?: string;
    elements: SixElements;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    userId?: string;
}

// 用户类型定义
export interface User {
    id: string;
    phone: string;
    nickname?: string;
    avatar?: string;
    createdAt: string;
    lastLoginAt?: string;
}

// 认证相关类型
export interface LoginForm {
    phone: string;
    password: string;
    remember?: boolean;
}

export interface RegisterForm {
    phone: string;
    password: string;
    confirmPassword: string;
    captcha?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiresIn: number;
}

// API 配置类型
export interface APIProvider {
    id: string;
    name: string;
    type: 'openai' | 'baidu' | 'alibaba' | 'tencent' | 'bytedance' | 'ollama';
    baseUrl: string;
    apiKey?: string;
    models: string[];
    enabled: boolean;
    config?: Record<string, any>;
}

export interface APIConfig {
    providers: APIProvider[];
    defaultProvider?: string;
}

// 生成配置类型
export interface GenerateConfig {
    provider: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}

// 生成结果类型
export interface GenerateResult {
    id: string;
    templateId: string;
    content: string;
    format: 'markdown' | 'json';
    config: GenerateConfig;
    createdAt: string;
}

// 应用状态类型
export interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    templates: Template[];
    currentTemplate: Template | null;
    apiConfig: APIConfig;
    loading: boolean;
    error: string | null;
}

// 组件 Props 类型
export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

// 表单验证规则类型
export interface ValidationRule {
    required?: boolean;
    message?: string;
    min?: number;
    max?: number;
    pattern?: RegExp;
    validator?: (rule: any, value: any) => Promise<void>;
}

// 路由类型
export interface RouteConfig {
    path: string;
    component: React.ComponentType;
    exact?: boolean;
    title?: string;
    requireAuth?: boolean;
}

// 菜单项类型
export interface MenuItem {
    key: string;
    label: string;
    icon?: React.ReactNode;
    path?: string;
    children?: MenuItem[];
    requireAuth?: boolean;
}

// 通知类型
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    createdAt: string;
}

// 分页类型
export interface Pagination {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
}

// 搜索过滤类型
export interface SearchFilter {
    keyword?: string;
    tags?: string[];
    dateRange?: [string, string];
    sortBy?: 'createdAt' | 'updatedAt' | 'name';
    sortOrder?: 'asc' | 'desc';
}

// HTTP 响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    code?: number;
}

// 错误类型
export interface ApiError {
    code: number;
    message: string;
    details?: any;
}

// 文件上传类型
export interface UploadFile {
    uid: string;
    name: string;
    status: 'uploading' | 'done' | 'error';
    url?: string;
    response?: any;
}

// 导出/导入类型
export interface ExportOptions {
    format: 'json' | 'markdown' | 'csv';
    includeMetadata?: boolean;
    templateIds?: string[];
}

export interface ImportResult {
    success: number;
    failed: number;
    errors: string[];
    templates: Template[];
}

// 提示词数据类型（SixElements 的别名，用于向后兼容）
export type PromptData = SixElements;
