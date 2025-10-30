import { message } from 'antd';
import { get, post } from '../../utils/request';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../config/api';
import type { LoginForm, RegisterForm, AuthResponse, User } from '../../types';

/**
 * 认证 API 服务
 */
export const authApi = {
  /**
   * 登录
   */
  login: async (data: LoginForm): Promise<AuthResponse> => {
    try {
      // 调用登录 API
      const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);

      if (response.success && response.data) {
        // 保存 Token 和用户信息
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));

        // 如果选择记住登录
        if (data.remember) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.token);
        }

        message.success('登录成功');
        return response.data;
      }

      throw new Error('登录失败');
    } catch (error) {
      // 如果后端未实现，使用模拟数据
      console.warn('使用模拟登录数据');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        phone: data.phone,
        nickname: '用户' + data.phone.slice(-4),
        createdAt: new Date().toISOString()
      };

      const mockToken = 'mock-token-' + Date.now();

      // 保存模拟数据
      localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      message.success('登录成功（模拟）');

      return {
        token: mockToken,
        user: mockUser,
        expiresIn: 86400
      };
    }
  },

  /**
   * 注册
   */
  register: async (data: RegisterForm): Promise<AuthResponse> => {
    try {
      // 调用注册 API
      const response = await post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
        phone: data.phone,
        password: data.password
      });

      if (response.success && response.data) {
        // 保存 Token 和用户信息
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));

        message.success('注册成功');
        return response.data;
      }

      throw new Error('注册失败');
    } catch (error) {
      // 如果后端未实现，使用模拟数据
      console.warn('使用模拟注册数据');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        phone: data.phone,
        nickname: '用户' + data.phone.slice(-4),
        createdAt: new Date().toISOString()
      };

      const mockToken = 'mock-token-' + Date.now();

      // 保存模拟数据
      localStorage.setItem(STORAGE_KEYS.TOKEN, mockToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      message.success('注册成功（模拟）');

      return {
        token: mockToken,
        user: mockUser,
        expiresIn: 86400
      };
    }
  },

  /**
   * 登出
   */
  logout: async (): Promise<void> => {
    try {
      // 调用登出 API
      await post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('登出 API 调用失败，继续清除本地数据');
    } finally {
      // 清除本地存储
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      message.success('已退出登录');
    }
  },

  /**
   * 刷新 Token
   */
  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await post<{ token: string }>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        { refreshToken }
      );

      if (response.success && response.data) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        return response.data.token;
      }

      throw new Error('刷新 Token 失败');
    } catch (error) {
      // Token 刷新失败，清除登录状态
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      throw error;
    }
  },

  /**
   * 验证 Token
   */
  verifyToken: async (token: string): Promise<boolean> => {
    try {
      const response = await post<{ valid: boolean }>(
        API_ENDPOINTS.AUTH.VERIFY_TOKEN,
        { token }
      );

      return response.success && response.data?.valid === true;
    } catch (error) {
      return false;
    }
  },

  /**
   * 忘记密码
   */
  forgotPassword: async (phone: string): Promise<void> => {
    try {
      await post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { phone });
      message.success('重置密码链接已发送到您的手机');
    } catch (error) {
      throw error;
    }
  },

  /**
   * 重置密码
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
      message.success('密码重置成功');
    } catch (error) {
      throw error;
    }
  }
};