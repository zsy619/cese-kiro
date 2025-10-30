// API 配置文件 - 统一管理 API 地址和配置

/**
 * API 基础配置
 */
export const API_CONFIG = {
  // 基础 URL
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  
  // 超时时间（毫秒）
  TIMEOUT: 30000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000
};

/**
 * API 端点路径
 */
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    VERIFY_TOKEN: '/api/auth/verify',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  
  // 用户相关
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/password',
    PREFERENCES: '/api/user/preferences',
    AVATAR: '/api/user/avatar'
  },
  
  // 模板相关
  TEMPLATE: {
    LIST: '/api/templates',
    CREATE: '/api/templates',
    DETAIL: (id: string) => `/api/templates/${id}`,
    UPDATE: (id: string) => `/api/templates/${id}`,
    DELETE: (id: string) => `/api/templates/${id}`,
    BATCH_DELETE: '/api/templates/batch-delete',
    EXPORT: '/api/templates/export',
    IMPORT: '/api/templates/import',
    SEARCH: '/api/templates/search',
    TAGS: '/api/templates/tags',
    STATISTICS: '/api/templates/statistics'
  },
  
  // AI API 配置相关
  API_CONFIG: {
    LIST: '/api/configs',
    CREATE: '/api/configs',
    DETAIL: (id: string) => `/api/configs/${id}`,
    UPDATE: (id: string) => `/api/configs/${id}`,
    DELETE: (id: string) => `/api/configs/${id}`,
    TEST: (id: string) => `/api/configs/${id}/test`,
    BATCH_TEST: '/api/configs/batch-test',
    EXPORT: '/api/configs/export',
    IMPORT: '/api/configs/import',
    STATISTICS: '/api/configs/statistics'
  },
  
  // AI 生成相关
  GENERATE: {
    PROMPT: '/api/generate/prompt',
    OPTIMIZE: '/api/generate/optimize',
    COMPLETE: '/api/generate/complete',
    SUGGEST: '/api/generate/suggest'
  },
  
  // 文件上传相关
  UPLOAD: {
    IMAGE: '/api/upload/image',
    FILE: '/api/upload/file',
    AVATAR: '/api/upload/avatar'
  },
  
  // 历史记录相关
  HISTORY: {
    LIST: '/api/history',
    DETAIL: (id: string) => `/api/history/${id}`,
    DELETE: (id: string) => `/api/history/${id}`,
    CLEAR: '/api/history/clear'
  }
};

/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

/**
 * 业务错误码
 */
export const ERROR_CODES = {
  // 通用错误
  SUCCESS: 0,
  UNKNOWN_ERROR: 1000,
  INVALID_PARAMS: 1001,
  NETWORK_ERROR: 1002,
  
  // 认证错误
  AUTH_FAILED: 2001,
  TOKEN_EXPIRED: 2002,
  TOKEN_INVALID: 2003,
  PERMISSION_DENIED: 2004,
  USER_NOT_FOUND: 2005,
  USER_ALREADY_EXISTS: 2006,
  PASSWORD_INCORRECT: 2007,
  
  // 模板错误
  TEMPLATE_NOT_FOUND: 3001,
  TEMPLATE_ALREADY_EXISTS: 3002,
  TEMPLATE_INVALID: 3003,
  
  // API 配置错误
  CONFIG_NOT_FOUND: 4001,
  CONFIG_INVALID: 4002,
  CONFIG_TEST_FAILED: 4003,
  
  // 文件上传错误
  FILE_TOO_LARGE: 5001,
  FILE_TYPE_INVALID: 5002,
  UPLOAD_FAILED: 5003
};

/**
 * 错误消息映射
 */
export const ERROR_MESSAGES: Record<number, string> = {
  [ERROR_CODES.UNKNOWN_ERROR]: '未知错误，请稍后重试',
  [ERROR_CODES.INVALID_PARAMS]: '参数错误',
  [ERROR_CODES.NETWORK_ERROR]: '网络错误，请检查网络连接',
  
  [ERROR_CODES.AUTH_FAILED]: '认证失败',
  [ERROR_CODES.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODES.TOKEN_INVALID]: '登录信息无效，请重新登录',
  [ERROR_CODES.PERMISSION_DENIED]: '权限不足',
  [ERROR_CODES.USER_NOT_FOUND]: '用户不存在',
  [ERROR_CODES.USER_ALREADY_EXISTS]: '用户已存在',
  [ERROR_CODES.PASSWORD_INCORRECT]: '密码错误',
  
  [ERROR_CODES.TEMPLATE_NOT_FOUND]: '模板不存在',
  [ERROR_CODES.TEMPLATE_ALREADY_EXISTS]: '模板已存在',
  [ERROR_CODES.TEMPLATE_INVALID]: '模板格式错误',
  
  [ERROR_CODES.CONFIG_NOT_FOUND]: 'API配置不存在',
  [ERROR_CODES.CONFIG_INVALID]: 'API配置无效',
  [ERROR_CODES.CONFIG_TEST_FAILED]: 'API连接测试失败',
  
  [ERROR_CODES.FILE_TOO_LARGE]: '文件太大',
  [ERROR_CODES.FILE_TYPE_INVALID]: '文件类型不支持',
  [ERROR_CODES.UPLOAD_FAILED]: '上传失败'
};

/**
 * 请求头配置
 */
export const REQUEST_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Token 存储键名
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  TEMPLATES: 'templates',
  API_CONFIG: 'apiConfig',
  USER_PREFERENCES: 'userPreferences',
  DRAFT: 'draft'
};

/**
 * 分页默认配置
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

/**
 * 文件上传配置
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: ['application/json', 'text/markdown', 'text/plain']
};

/**
 * AI 提供商配置
 */
export const AI_PROVIDERS = {
  OPENAI: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
  },
  BAIDU: {
    id: 'baidu',
    name: '百度文心一言',
    baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
    models: ['ernie-bot', 'ernie-bot-turbo']
  },
  ALIBABA: {
    id: 'alibaba',
    name: '阿里通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max']
  },
  TENCENT: {
    id: 'tencent',
    name: '腾讯混元',
    baseUrl: 'https://hunyuan.tencentcloudapi.com',
    models: ['hunyuan-lite', 'hunyuan-standard', 'hunyuan-pro']
  },
  BYTEDANCE: {
    id: 'bytedance',
    name: '字节豆包',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: ['doubao-lite', 'doubao-pro']
  },
  OLLAMA: {
    id: 'ollama',
    name: '本地 Ollama',
    baseUrl: 'http://localhost:11434/api',
    models: ['deepseek-coder', 'llama2', 'mistral']
  }
};

/**
 * 获取完整的 API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * 获取错误消息
 */
export const getErrorMessage = (code: number): string => {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
};