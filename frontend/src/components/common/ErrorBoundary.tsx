import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button, Typography, Card } from 'antd';
import { 
  ExclamationCircleOutlined, 
  ReloadOutlined, 
  HomeOutlined,
  BugOutlined 
} from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // 调用错误回调
    this.props.onError?.(error, errorInfo);
    
    // 在开发环境下打印错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误页面
      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
          <Card className='max-w-2xl w-full'>
            <Result
              status='error'
              icon={<ExclamationCircleOutlined className='text-red-500' />}
              title='页面出现错误'
              subTitle='抱歉，页面遇到了一些问题。请尝试刷新页面或返回首页。'
              extra={[
                <Button 
                  key='retry' 
                  type='primary' 
                  icon={<ReloadOutlined />}
                  onClick={this.handleRetry}
                >
                  重试
                </Button>,
                <Button 
                  key='reload' 
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                >
                  刷新页面
                </Button>,
                <Button 
                  key='home' 
                  icon={<HomeOutlined />}
                  onClick={this.handleGoHome}
                >
                  返回首页
                </Button>
              ]}
            >
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className='mt-6 p-4 bg-gray-100 rounded-lg text-left'>
                  <div className='flex items-center mb-2'>
                    <BugOutlined className='mr-2 text-red-500' />
                    <Text strong>开发调试信息</Text>
                  </div>
                  <Paragraph>
                    <Text code className='text-red-600'>
                      {this.state.error.name}: {this.state.error.message}
                    </Text>
                  </Paragraph>
                  {this.state.error.stack && (
                    <details className='mt-2'>
                      <summary className='cursor-pointer text-gray-600 hover:text-gray-800'>
                        查看错误堆栈
                      </summary>
                      <pre className='mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40'>
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </Result>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// 网络错误组件
export const NetworkError: React.FC<{
  onRetry?: () => void;
  message?: string;
}> = ({ 
  onRetry, 
  message = '网络连接失败，请检查网络设置后重试' 
}) => {
  return (
    <Result
      status='error'
      title='网络错误'
      subTitle={message}
      extra={
        onRetry && (
          <Button type='primary' icon={<ReloadOutlined />} onClick={onRetry}>
            重新加载
          </Button>
        )
      }
    />
  );
};

// 404 错误组件
export const NotFound: React.FC<{
  title?: string;
  subTitle?: string;
  showHomeButton?: boolean;
}> = ({ 
  title = '页面不存在',
  subTitle = '抱歉，您访问的页面不存在或已被删除',
  showHomeButton = true
}) => {
  return (
    <Result
      status='404'
      title={title}
      subTitle={subTitle}
      extra={
        showHomeButton && (
          <Button type='primary' icon={<HomeOutlined />} href='/'>
            返回首页
          </Button>
        )
      }
    />
  );
};

// 403 权限错误组件
export const Forbidden: React.FC<{
  title?: string;
  subTitle?: string;
}> = ({ 
  title = '访问被拒绝',
  subTitle = '抱歉，您没有权限访问此页面'
}) => {
  return (
    <Result
      status='403'
      title={title}
      subTitle={subTitle}
      extra={
        <Button type='primary' icon={<HomeOutlined />} href='/'>
          返回首页
        </Button>
      }
    />
  );
};

// 500 服务器错误组件
export const ServerError: React.FC<{
  onRetry?: () => void;
  message?: string;
}> = ({ 
  onRetry,
  message = '服务器出现错误，请稍后重试'
}) => {
  return (
    <Result
      status='500'
      title='服务器错误'
      subTitle={message}
      extra={
        <div className='space-x-2'>
          {onRetry && (
            <Button type='primary' icon={<ReloadOutlined />} onClick={onRetry}>
              重试
            </Button>
          )}
          <Button icon={<HomeOutlined />} href='/'>
            返回首页
          </Button>
        </div>
      }
    />
  );
};

export default ErrorBoundary;