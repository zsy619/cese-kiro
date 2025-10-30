import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button 组件', () => {
    test('渲染基础按钮', () => {
        render(<Button>点击我</Button>);
        const button = screen.getByText('点击我');
        expect(button).toBeInTheDocument();
    });

    test('处理点击事件', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>点击我</Button>);
        const button = screen.getByText('点击我');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('禁用状态下不触发点击', () => {
        const handleClick = jest.fn();
        render(
            <Button disabled onClick={handleClick}>
                点击我
            </Button>
        );
        const button = screen.getByText('点击我');
        fireEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    test('加载状态显示加载图标', () => {
        render(<Button loading>加载中</Button>);
        const button = screen.getByText('加载中');
        expect(button).toBeInTheDocument();
        // 加载状态下按钮应该被禁用
        expect(button.closest('button')).toBeDisabled();
    });

    test('全宽度按钮应用正确的类名', () => {
        const { container } = render(<Button fullWidth>全宽按钮</Button>);
        const button = container.querySelector('button');
        expect(button).toHaveClass('w-full');
    });

    test('不同变体渲染正确', () => {
        const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'text'> = [
            'primary',
            'secondary',
            'outline',
            'ghost',
            'link',
            'text'
        ];

        variants.forEach((variant) => {
            const { unmount } = render(<Button variant={variant}>{variant}</Button>);
            expect(screen.getByText(variant)).toBeInTheDocument();
            unmount();
        });
    });

    test('不同尺寸渲染正确', () => {
        const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

        sizes.forEach((size) => {
            const { unmount } = render(<Button size={size}>{size}</Button>);
            expect(screen.getByText(size)).toBeInTheDocument();
            unmount();
        });
    });
});
