import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from '../HomePage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

describe('HomePage 组件', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    const renderHomePage = () => {
        return render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );
    };

    test('渲染页面标题', () => {
        renderHomePage();
        expect(screen.getByText('上下文工程六要素')).toBeInTheDocument();
    });

    test('渲染六要素卡片', () => {
        renderHomePage();
        expect(screen.getByText('任务目标')).toBeInTheDocument();
        expect(screen.getByText('AI的角色')).toBeInTheDocument();
        expect(screen.getByText('我的角色')).toBeInTheDocument();
        expect(screen.getByText('关键信息')).toBeInTheDocument();
        expect(screen.getByText('行为规则')).toBeInTheDocument();
        expect(screen.getByText('交付格式')).toBeInTheDocument();
    });

    test('渲染核心功能区域', () => {
        renderHomePage();
        expect(screen.getByText('核心功能')).toBeInTheDocument();
        expect(screen.getByText('智能提示词生成')).toBeInTheDocument();
        expect(screen.getByText('主题管理系统')).toBeInTheDocument();
    });

    test('点击立即体验按钮导航到生成器页面', () => {
        renderHomePage();
        const buttons = screen.getAllByText('立即体验');
        fireEvent.click(buttons[0]);
        expect(mockNavigate).toHaveBeenCalledWith('/generator');
    });

    test('点击查看模板按钮导航到模板页面', () => {
        renderHomePage();
        const button = screen.getByText('查看模板');
        fireEvent.click(button);
        expect(mockNavigate).toHaveBeenCalledWith('/templates');
    });

    test('渲染统计数据', () => {
        renderHomePage();
        expect(screen.getByText('用户数量')).toBeInTheDocument();
        expect(screen.getByText('生成模板数')).toBeInTheDocument();
        expect(screen.getByText('活跃用户数')).toBeInTheDocument();
    });
});
