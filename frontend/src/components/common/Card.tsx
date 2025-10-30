import React, { useState } from 'react';
import { Card as AntCard, CardProps as AntCardProps, Collapse, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';

const { Panel } = Collapse;

export interface CardProps extends Omit<AntCardProps, 'size' | 'variant'> {
    cardVariant?: 'default' | 'bordered' | 'shadow' | 'elevated';
    size?: 'small' | 'medium' | 'large';
    hoverable?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export interface ActionCardProps extends CardProps {
    actions?: React.ReactNode[];
    primaryAction?: {
        label: string;
        onClick: () => void;
        loading?: boolean;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

export interface CollapsibleCardProps extends CardProps {
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    onCollapseChange?: (collapsed: boolean) => void;
}

// 基础 Card 组件
const Card: React.FC<CardProps> = ({
    cardVariant = 'default',
    size = 'medium',
    hoverable = false,
    loading = false,
    className,
    children,
    ...props
}) => {
    const getCardClasses = () => {
        const baseClasses = 'transition-all duration-200';

        const variantClasses = {
            default: '',
            bordered: 'border border-gray-200',
            shadow: 'shadow-sm hover:shadow-md',
            elevated: 'shadow-lg hover:shadow-xl'
        };

        const sizeClasses = {
            small: '[&_.ant-card-body]:p-3',
            medium: '[&_.ant-card-body]:p-4',
            large: '[&_.ant-card-body]:p-6'
        };

        return classNames(
            baseClasses,
            variantClasses[cardVariant],
            sizeClasses[size],
            {
                'hover:shadow-md cursor-pointer': hoverable && !loading,
                'opacity-50': loading
            },
            className
        );
    };

    return (
        <AntCard
            {...props}
            className={getCardClasses()}
            loading={loading}
        >
            {children}
        </AntCard>
    );
};

// 带操作按钮的 Card 组件
export const ActionCard: React.FC<ActionCardProps> = ({
    actions,
    primaryAction,
    secondaryAction,
    children,
    ...cardProps
}) => {
    const cardActions = actions || [];

    // 如果有主要和次要操作，添加到 actions 中
    if (primaryAction || secondaryAction) {
        const actionButtons = (
            <div className='flex justify-end space-x-2'>
                {secondaryAction && (
                    <Button onClick={secondaryAction.onClick}>
                        {secondaryAction.label}
                    </Button>
                )}
                {primaryAction && (
                    <Button
                        type='primary'
                        loading={primaryAction.loading}
                        onClick={primaryAction.onClick}
                    >
                        {primaryAction.label}
                    </Button>
                )}
            </div>
        );
        cardActions.push(actionButtons);
    }

    return (
        <Card {...cardProps} actions={cardActions.length > 0 ? cardActions : undefined}>
            {children}
        </Card>
    );
};

// 可折叠的 Card 组件
export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
    collapsible = true,
    defaultCollapsed = false,
    onCollapseChange,
    title,
    children,
    ...cardProps
}) => {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    const handleCollapseToggle = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        onCollapseChange?.(newCollapsed);
    };

    if (!collapsible) {
        return (
            <Card {...cardProps} title={title}>
                {children}
            </Card>
        );
    }

    const cardTitle = (
        <div className='flex items-center justify-between w-full'>
            <span>{title}</span>
            <Button
                type='text'
                size='small'
                icon={collapsed ? <DownOutlined /> : <UpOutlined />}
                onClick={handleCollapseToggle}
            />
        </div>
    );

    return (
        <Card {...cardProps} title={cardTitle}>
            <Collapse ghost activeKey={collapsed ? [] : ['content']} bordered={false}>
                <Panel header='' key='content' showArrow={false}>
                    {children}
                </Panel>
            </Collapse>
        </Card>
    );
};

export default Card;
