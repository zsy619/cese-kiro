import { LoginForm, RegisterForm, AuthResponse, User } from '../types';

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据存储
const USERS_KEY = 'cese_users';
const TOKEN_KEY = 'cese_token';
const USER_KEY = 'cese_user';

// 获取存储的用户数据
const getStoredUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// 保存用户数据
const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// 生成简单的 JWT Token (仅用于演示)
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};

// 验证 Token
const validateToken = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
};

// 从 Token 获取用户ID
const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch {
    return null;
  }
};

export const authService = {
  // 用户注册
  async register(registerData: RegisterForm): Promise<AuthResponse> {
    await delay(1000); // 模拟网络延迟

    const users = getStoredUsers();
    
    // 检查手机号是否已存在
    const existingUser = users.find(user => user.phone === registerData.phone);
    if (existingUser) {
      throw new Error('手机号已被注册');
    }

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      phone: registerData.phone,
      nickname: `用户${registerData.phone.slice(-4)}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // 保存用户（实际应用中密码需要加密存储）
    const userWithPassword = {
      ...newUser,
      password: registerData.password // 实际应用中应该加密
    };
    
    users.push(userWithPassword);
    saveUsers(users);

    // 生成 Token
    const token = generateToken(newUser.id);

    return {
      token,
      user: newUser,
      expiresIn: 24 * 60 * 60 * 1000 // 24小时
    };
  },

  // 用户登录
  async login(loginData: LoginForm): Promise<AuthResponse> {
    await delay(800); // 模拟网络延迟

    const users = getStoredUsers();
    
    // 查找用户
    const user = users.find(u => 
      u.phone === loginData.phone && 
      (u as any).password === loginData.password
    );

    if (!user) {
      throw new Error('手机号或密码错误');
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date().toISOString();
    saveUsers(users);

    // 生成 Token
    const token = generateToken(user.id);

    // 保存登录状态
    if (loginData.remember) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      },
      expiresIn: 24 * 60 * 60 * 1000
    };
  },

  // 获取当前用户信息
  getCurrentUser(): User | null {
    try {
      // 先检查 localStorage，再检查 sessionStorage
      let token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      let userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

      if (!token || !userStr || !validateToken(token)) {
        this.logout();
        return null;
      }

      return JSON.parse(userStr);
    } catch {
      this.logout();
      return null;
    }
  },

  // 检查登录状态
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    return !!(token && validateToken(token));
  },

  // 获取 Token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  // 登出
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  // 更新用户信息
  async updateUser(userData: Partial<User>): Promise<User> {
    await delay(500);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }

    // 更新用户信息
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      id: currentUser.id, // 确保ID不被修改
      phone: currentUser.phone, // 确保手机号不被修改
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    saveUsers(users);

    // 更新本地存储的用户信息
    const userForStorage = {
      id: updatedUser.id,
      phone: updatedUser.phone,
      nickname: updatedUser.nickname,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
      lastLoginAt: updatedUser.lastLoginAt
    };

    if (localStorage.getItem(USER_KEY)) {
      localStorage.setItem(USER_KEY, JSON.stringify(userForStorage));
    } else {
      sessionStorage.setItem(USER_KEY, JSON.stringify(userForStorage));
    }

    return userForStorage;
  },

  // 修改密码
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await delay(800);

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('用户未登录');
    }

    const users = getStoredUsers();
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user || (user as any).password !== oldPassword) {
      throw new Error('原密码错误');
    }

    // 更新密码
    (user as any).password = newPassword;
    saveUsers(users);
  }
};