import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, Template, APIConfig } from '../types';
import { authService } from '../services/authService';

// 初始状态
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  templates: [],
  currentTemplate: null,
  apiConfig: {
    providers: [],
    defaultProvider: undefined
  },
  loading: false,
  error: null
};

// Action 类型
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_TEMPLATES'; payload: Template[] }
  | { type: 'ADD_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_TEMPLATE'; payload: Template }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'SET_CURRENT_TEMPLATE'; payload: Template | null }
  | { type: 'SET_API_CONFIG'; payload: APIConfig }
  | { type: 'RESET_STATE' };

// Reducer 函数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
  case 'SET_LOADING':
    return { ...state, loading: action.payload };
  
  case 'SET_ERROR':
    return { ...state, error: action.payload };
  
  case 'SET_USER':
    return { ...state, user: action.payload };
  
  case 'SET_AUTHENTICATED':
    return { ...state, isAuthenticated: action.payload };
  
  case 'SET_TEMPLATES':
    return { ...state, templates: action.payload };
  
  case 'ADD_TEMPLATE':
    return { 
      ...state, 
      templates: [...state.templates, action.payload] 
    };
  
  case 'UPDATE_TEMPLATE':
    return {
      ...state,
      templates: state.templates.map(template =>
        template.id === action.payload.id ? action.payload : template
      ),
      currentTemplate: state.currentTemplate?.id === action.payload.id 
        ? action.payload 
        : state.currentTemplate
    };
  
  case 'DELETE_TEMPLATE':
    return {
      ...state,
      templates: state.templates.filter(template => template.id !== action.payload),
      currentTemplate: state.currentTemplate?.id === action.payload 
        ? null 
        : state.currentTemplate
    };
  
  case 'SET_CURRENT_TEMPLATE':
    return { ...state, currentTemplate: action.payload };
  
  case 'SET_API_CONFIG':
    return { ...state, apiConfig: action.payload };
  
  case 'RESET_STATE':
    return initialState;
  
  default:
    return state;
  }
}

// Context 类型
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // 便捷方法
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (templateId: string) => void;
  setCurrentTemplate: (template: Template | null) => void;
  logout: () => void;
}

// 创建 Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider 组件
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 便捷方法
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setAuthenticated = (authenticated: boolean) => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: authenticated });
  };

  const addTemplate = (template: Template) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const updateTemplate = (template: Template) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: template });
  };

  const deleteTemplate = (templateId: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
  };

  const setCurrentTemplate = (template: Template | null) => {
    dispatch({ type: 'SET_CURRENT_TEMPLATE', payload: template });
  };

  const logout = () => {
    // 使用 authService 登出
    authService?.logout?.();
    // 重置状态
    dispatch({ type: 'RESET_STATE' });
  };

  // 初始化时从本地存储恢复状态
  useEffect(() => {
    // 使用 authService 检查登录状态
    const currentUser = authService?.getCurrentUser?.();
    const isAuth = authService?.isAuthenticated?.();
    
    if (currentUser && isAuth) {
      setUser(currentUser);
      setAuthenticated(true);
    } else {
      // 清理无效的登录状态
      logout();
    }

    // 恢复 API 配置
    const apiConfigStr = localStorage.getItem('apiConfig');
    if (apiConfigStr) {
      try {
        const apiConfig = JSON.parse(apiConfigStr);
        dispatch({ type: 'SET_API_CONFIG', payload: apiConfig });
      } catch (error) {
        console.error('解析 API 配置失败:', error);
      }
    }

    // 恢复模板数据
    const templatesStr = localStorage.getItem('templates');
    if (templatesStr) {
      try {
        const templates = JSON.parse(templatesStr);
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
      } catch (error) {
        console.error('解析模板数据失败:', error);
      }
    }
  }, []);

  // 监听状态变化，同步到本地存储
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(state.templates));
  }, [state.templates]);

  useEffect(() => {
    localStorage.setItem('apiConfig', JSON.stringify(state.apiConfig));
  }, [state.apiConfig]);

  const contextValue: AppContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    setUser,
    setAuthenticated,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    setCurrentTemplate,
    logout
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook 用于使用 Context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp 必须在 AppProvider 内部使用');
  }
  return context;
};