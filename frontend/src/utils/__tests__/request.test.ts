import { formatPromptToMarkdown, formatPromptToJSON } from '../promptFormatter';
import type { PromptData } from '../../types';

describe('提示词格式化工具', () => {
    const mockPromptData: PromptData = {
        taskGoal: '创建一个用户注册功能',
        aiRole: '资深全栈开发工程师',
        userRole: '产品经理',
        keyInfo: '需要支持手机号和邮箱注册',
        behaviorRules: '遵循 RESTful API 设计规范',
        deliveryFormat: 'API 接口文档和代码实现'
    };

    describe('formatPromptToMarkdown', () => {
        test('正确格式化为 Markdown', () => {
            const result = formatPromptToMarkdown(mockPromptData);

            expect(result).toContain('# 任务目标');
            expect(result).toContain('创建一个用户注册功能');
            expect(result).toContain('# AI的角色');
            expect(result).toContain('资深全栈开发工程师');
            expect(result).toContain('# 我的角色');
            expect(result).toContain('产品经理');
        });

        test('处理空字段', () => {
            const emptyData: PromptData = {
                taskGoal: '',
                aiRole: '',
                userRole: '',
                keyInfo: '',
                behaviorRules: '',
                deliveryFormat: ''
            };

            const result = formatPromptToMarkdown(emptyData);
            expect(result).toContain('# 任务目标');
            expect(result).toContain('# AI的角色');
        });
    });

    describe('formatPromptToJSON', () => {
        test('正确格式化为 JSON', () => {
            const result = formatPromptToJSON(mockPromptData);
            const parsed = JSON.parse(result);

            expect(parsed.taskGoal).toBe('创建一个用户注册功能');
            expect(parsed.aiRole).toBe('资深全栈开发工程师');
            expect(parsed.userRole).toBe('产品经理');
        });

        test('JSON 格式正确缩进', () => {
            const result = formatPromptToJSON(mockPromptData);
            expect(result).toContain('  '); // 检查是否有缩进
        });
    });
});
