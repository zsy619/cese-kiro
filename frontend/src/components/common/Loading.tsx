import React from 'react';
import { Spin, Skeleton, Progress } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  overlay?: boolean;
  className?: string;
}

export interface SkeletonLoadingProps {
  rows?: number;
  avatar?: boolean;
  title?: boolean;
  active?: boolean;
  className?: string;
}

export interface ProgressLoadingProps {
  percent: number;
  text?: string;
  status?: 'normal' | 'exception' | 'success';
  showInfo?: boolean;
  className?: string;
}

// 基础加载组件
const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text,
  overlay = false,
  className
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'medium':
        return { fontSize: 18 };
      case 'large':
        return { fontSize: 24 };
      default:
        return { fontSize: 18 };
    }
  };

  const loadingIcon = <LoadingOutlined style={getSizeConfig()} spin />;

  const loadingClasses = classNames(
    'flex flex-col items-center justify-center',
    {
      'fixed inset-0 bg-white bg-opacity-75 z-50': overlay,
      'py-8': !overlay
    },
    className
  );

  return (
    <div className={loadingClasses}>
      <Spin indicator={loadingIcon} size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'default'} />
      {text && (
        <div className='mt-3 text-gray-600 text-center'>
          {text}
        </div>
      )}
    </div>
  );
};

// 骨架屏加载组件
export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  rows = 3,
  avatar = false,
  title = true,
  active = true,
  className
}) => {
  return (
    <div className={className}>
      <Skeleton
        avatar={avatar}
        title={title}
        paragraph={{ rows }}
        active={active}
      />
    </div>
  );
};

// 进度条加载组件
export const ProgressLoading: React.FC<ProgressLoadingProps> = ({
  percent,
  text,
  status = 'normal',
  showInfo = true,
  className
}) => {
  return (
    <div className={classNames('space-y-2', className)}>
      {text && (
        <div className='text-sm text-gray-600 text-center'>
          {text}
        </div>
      )}
      <Progress
        percent={percent}
        status={status}
        showInfo={showInfo}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068'
        }}
      />
    </div>
  );
};

// 页面加载组件
export const PageLoading: React.FC<{ text?: string }> = ({ text = '页面加载中...' }) => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='mb-4'>
          <Spin size='large' />
        </div>
        <div className='text-gray-600 text-lg'>
          {text}
        </div>
      </div>
    </div>
  );
};

// 内容加载组件
export const ContentLoading: React.FC<{ text?: string; height?: number }> = ({ 
  text = '内容加载中...', 
  height = 200 
}) => {
  return (
    <div 
      className='flex items-center justify-center bg-gray-50 rounded-lg'
      style={{ height }}
    >
      <div className='text-center'>
        <div className='mb-2'>
          <Spin />
        </div>
        <div className='text-gray-500 text-sm'>
          {text}
        </div>
      </div>
    </div>
  );
};

// 按钮加载状态
export const ButtonLoading: React.FC<{ text?: string }> = ({ text = '处理中...' }) => {
  return (
    <span className='flex items-center space-x-2'>
      <LoadingOutlined />
      <span>{text}</span>
    </span>
  );
};

export default Loading;