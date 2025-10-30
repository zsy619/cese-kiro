import React, { useState } from 'react';
import { Input as AntInput, InputProps as AntInputProps } from 'antd';
import { ClearOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import classNames from 'classnames';

const { TextArea, Password } = AntInput;

export interface InputProps extends Omit<AntInputProps, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  showCount?: boolean;
  clearable?: boolean;
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  clearable?: boolean;
}

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  visibilityToggle?: boolean;
}

// 基础 Input 组件
const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = false,
  showCount = false,
  clearable = false,
  className,
  ...props
}) => {
  const [value, setValue] = useState(props.value || props.defaultValue || '');

  const getAntSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'middle';
      case 'large':
        return 'large';
      default:
        return 'middle';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setValue('');
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    props.onChange?.(event);
  };

  const inputClasses = classNames(
    {
      'w-full': fullWidth,
      'border-red-300 focus:border-red-500': error
    },
    className
  );

  const suffix = clearable && value ? (
    <ClearOutlined 
      className='cursor-pointer text-gray-400 hover:text-gray-600' 
      onClick={handleClear}
    />
  ) : props.suffix;

  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {props.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      
      <AntInput
        {...props}
        size={getAntSize()}
        className={inputClasses}
        value={value}
        onChange={handleChange}
        suffix={suffix}
        showCount={showCount}
        status={error ? 'error' : undefined}
      />
      
      {(error || helperText) && (
        <div className='text-sm'>
          {error ? (
            <span className='text-red-500'>{error}</span>
          ) : (
            <span className='text-gray-500'>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};

// TextArea 组件
export const InputTextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  showCount = false,
  autoSize = { minRows: 3, maxRows: 8 },
  clearable = false,
  className,
  ...props
}) => {
  const [value, setValue] = useState(props.value || props.defaultValue || '');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const handleClear = () => {
    setValue('');
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    props.onChange?.(event);
  };

  const textAreaClasses = classNames(
    'resize-none',
    {
      'border-red-300 focus:border-red-500': error
    },
    className
  );

  return (
    <div className='space-y-1'>
      {label && (
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-gray-700'>
            {label}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
          </label>
          {clearable && value && (
            <ClearOutlined 
              className='cursor-pointer text-gray-400 hover:text-gray-600' 
              onClick={handleClear}
            />
          )}
        </div>
      )}
      
      <TextArea
        {...props}
        className={textAreaClasses}
        value={value}
        onChange={handleChange}
        autoSize={autoSize}
        showCount={showCount}
        status={error ? 'error' : undefined}
      />
      
      {(error || helperText) && (
        <div className='text-sm'>
          {error ? (
            <span className='text-red-500'>{error}</span>
          ) : (
            <span className='text-gray-500'>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Password Input 组件
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  helperText,
  size = 'medium',
  fullWidth = false,
  visibilityToggle = true,
  className,
  ...props
}) => {
  const getAntSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'medium':
        return 'middle';
      case 'large':
        return 'large';
      default:
        return 'middle';
    }
  };

  const inputClasses = classNames(
    {
      'w-full': fullWidth,
      'border-red-300 focus:border-red-500': error
    },
    className
  );

  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {props.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      
      <Password
        {...props}
        size={getAntSize()}
        className={inputClasses}
        iconRender={visibilityToggle ? 
          (visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />) : 
          undefined
        }
        status={error ? 'error' : undefined}
      />
      
      {(error || helperText) && (
        <div className='text-sm'>
          {error ? (
            <span className='text-red-500'>{error}</span>
          ) : (
            <span className='text-gray-500'>{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;