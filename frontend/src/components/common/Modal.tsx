import React from 'react';
import { Modal as AntModal, ModalProps as AntModalProps, Button, Space } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export interface ModalProps extends Omit<AntModalProps, 'size'> {
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  variant?: 'default' | 'form' | 'confirmation';
  children: React.ReactNode;
}

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  content?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  danger?: boolean;
}

export interface FormModalProps extends ModalProps {
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  submitLoading?: boolean;
  submitDisabled?: boolean;
}

// 基础 Modal 组件
const Modal: React.FC<ModalProps> = ({
  size = 'medium',
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const getModalWidth = () => {
    switch (size) {
      case 'small':
        return 400;
      case 'medium':
        return 600;
      case 'large':
        return 800;
      case 'fullscreen':
        return '100vw';
      default:
        return 600;
    }
  };

  const getModalClasses = () => {
    const baseClasses = 'custom-modal';
    
    const variantClasses = {
      default: '',
      form: 'form-modal',
      confirmation: 'confirm-modal'
    };

    const sizeClasses = {
      small: 'modal-small',
      medium: 'modal-medium', 
      large: 'modal-large',
      fullscreen: 'modal-fullscreen'
    };

    return classNames(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );
  };

  const modalProps = {
    ...props,
    width: getModalWidth(),
    className: getModalClasses(),
    centered: size !== 'fullscreen',
    ...(size === 'fullscreen' && {
      style: { top: 0, paddingBottom: 0 },
      bodyStyle: { height: 'calc(100vh - 110px)', overflow: 'auto' }
    })
  };

  return (
    <AntModal {...modalProps}>
      {children}
    </AntModal>
  );
};

// 确认对话框组件
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  content,
  type = 'warning',
  onConfirm,
  onCancel,
  confirmText = '确定',
  cancelText = '取消',
  confirmLoading = false,
  danger = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <InfoCircleOutlined className='text-blue-500' />;
      case 'success':
        return <CheckCircleOutlined className='text-green-500' />;
      case 'warning':
        return <ExclamationCircleOutlined className='text-yellow-500' />;
      case 'error':
        return <ExclamationCircleOutlined className='text-red-500' />;
      default:
        return <ExclamationCircleOutlined className='text-yellow-500' />;
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div className='flex items-center space-x-2'>
          {getIcon()}
          <span>{title}</span>
        </div>
      }
      size='small'
      variant='confirmation'
      footer={
        <Space>
          <Button onClick={onCancel} disabled={confirmLoading}>
            {cancelText}
          </Button>
          <Button
            type='primary'
            danger={danger}
            loading={confirmLoading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </Space>
      }
      onCancel={onCancel}
      maskClosable={!confirmLoading}
      closable={!confirmLoading}
    >
      {content && (
        <div className='py-4'>
          {typeof content === 'string' ? (
            <p className='text-gray-600'>{content}</p>
          ) : (
            content
          )}
        </div>
      )}
    </Modal>
  );
};

// 表单对话框组件
export const FormModal: React.FC<FormModalProps> = ({
  onSubmit,
  onCancel,
  submitText = '确定',
  cancelText = '取消',
  submitLoading = false,
  submitDisabled = false,
  children,
  ...modalProps
}) => {
  const footer = (
    <Space>
      <Button onClick={onCancel} disabled={submitLoading}>
        {cancelText}
      </Button>
      <Button
        type='primary'
        loading={submitLoading}
        disabled={submitDisabled}
        onClick={onSubmit}
      >
        {submitText}
      </Button>
    </Space>
  );

  return (
    <Modal
      {...modalProps}
      variant='form'
      footer={footer}
      onCancel={onCancel}
      maskClosable={!submitLoading}
      closable={!submitLoading}
    >
      {children}
    </Modal>
  );
};

// 全屏对话框组件
export const FullscreenModal: React.FC<ModalProps> = ({
  children,
  ...props
}) => {
  return (
    <Modal
      {...props}
      size='fullscreen'
      footer={null}
    >
      {children}
    </Modal>
  );
};

export default Modal;