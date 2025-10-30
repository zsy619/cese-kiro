import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';
import {
  API_CONFIG,
  HTTP_STATUS,
  ERROR_CODES,
  getErrorMessage,
  STORAGE_KEYS,
  REQUEST_HEADERS
} from '../config/api';
import type { ApiResponse, ApiError } from '../types';

/**
 * 创建 Axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: REQUEST_HEADERS
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    // 添加 Token
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 检查业务状态码
    if (data.success === false) {
      const errorMessage = data.message || getErrorMessage(data.code || ERROR_CODES.UNKNOWN_ERROR);
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    // 处理网络错误
    if (!error.response) {
      message.error('网络错误，请检查网络连接');
      return Promise.reject(error);
    }
    
    const { status, data } = error.response;
    
    // 处理不同的 HTTP 状态码
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Token 过期或无效
        message.error('登录已过期，请重新登录');
        // 清除本地存储
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        // 跳转到登录页
        window.location.href = '/';
        break;
        
      case HTTP_STATUS.FORBIDDEN:
        message.error('权限不足');
        break;
        
      case HTTP_STATUS.NOT_FOUND:
        message.error('请求的资源不存在');
        break;
        
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message.error('服务器错误，请稍后重试');
        break;
        
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        message.error('服务暂时不可用，请稍后重试');
        break;
        
      default:
        const errorMessage = data?.message || getErrorMessage(data?.code || ERROR_CODES.UNKNOWN_ERROR);
        message.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

/**
 * 请求重试函数
 */
const retryRequest = async (
  config: AxiosRequestConfig,
  retries: number = API_CONFIG.MAX_RETRIES
): Promise<AxiosResponse> => {
  try {
    return await instance.request(config);
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return retryRequest(config, retries - 1);
    }
    throw error;
  }
};

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return instance.get(url, { params, ...config }).then(res => res.data);
};

/**
 * POST 请求
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return instance.post(url, data, config).then(res => res.data);
};

/**
 * PUT 请求
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return instance.put(url, data, config).then(res => res.data);
};

/**
 * DELETE 请求
 */
export const del = <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return instance.delete(url, config).then(res => res.data);
};

/**
 * PATCH 请求
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  return instance.patch(url, data, config).then(res => res.data);
};

/**
 * 文件上传
 */
export const upload = <T = any>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  return instance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    }
  }).then(res => res.data);
};

/**
 * 文件下载
 */
export const download = async (
  url: string,
  filename: string,
  params?: any
): Promise<void> => {
  try {
    const response = await instance.get(url, {
      params,
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    message.success('下载成功');
  } catch (error) {
    message.error('下载失败');
    throw error;
  }
};

/**
 * 批量请求
 */
export const batchRequest = async <T = any>(
  requests: Array<() => Promise<ApiResponse<T>>>
): Promise<ApiResponse<T>[]> => {
  try {
    return await Promise.all(requests.map(request => request()));
  } catch (error) {
    console.error('批量请求失败:', error);
    throw error;
  }
};

/**
 * 取消请求的 Token
 */
export const CancelToken = axios.CancelToken;

/**
 * 判断是否为取消请求的错误
 */
export const isCancel = axios.isCancel;

export default instance;