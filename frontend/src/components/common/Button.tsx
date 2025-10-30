import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export interface ButtonProps extends Omit<AntButtonProps, 'size' | 'type' | 'variant'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'text';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    fullWidth = false,
    className,
    children,
    ...props
}) => {
    // 映射自定义 variant 到 Ant Design type 和 ghost
    const getAntType = (): AntButtonProps['type'] => {
        switch (variant) {
            case 'primary':
                return 'primary';
            case 'secondary':
                return 'default';
            case 'outline':
                return 'default';
            case 'ghost':
                return 'default'; // ghost 使用 default type + ghost prop
            case 'link':
                return 'link';
            case 'text':
                return 'text';
            default:
                return 'primary';
        }
    };

    // 判断是否使用 ghost 样式
    const isGhost = variant === 'ghost';

    // 映射自定义 size 到 Ant Design size
    const getAntSize = (): AntButtonProps['size'] => {
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

    // 自定义样式类
    const buttonClasses = classNames(
        'transition-all duration-200',
        {
            'w-full': fullWidth,
            'border-2': variant === 'outline',
            'hover:shadow-md': !disabled && !loading,
            'cursor-not-allowed opacity-50': disabled
        },
        className
    );

    return (
        <AntButton
            type={getAntType()}
            ghost={isGhost}
            size={getAntSize()}
            loading={loading}
            disabled={disabled || loading}
            className={buttonClasses}
            icon={loading ? <LoadingOutlined /> : props.icon}
            {...props}
        >
            {children}
        </AntButton>
    );
};

export default Button;
