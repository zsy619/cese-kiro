import type { PromptData } from '../types';

/**
 * 将提示词数据格式化为 Markdown 格式
 */
export function formatPromptToMarkdown(data: PromptData): string {
    return `# 任务目标

${data.taskGoal || ''}

# AI的角色

${data.aiRole || ''}

# 我的角色

${data.userRole || ''}

# 关键信息

${data.keyInfo || ''}

# 行为规则

${data.behaviorRules || ''}

# 交付格式

${data.deliveryFormat || ''}
`;
}

/**
 * 将提示词数据格式化为 JSON 格式
 */
export function formatPromptToJSON(data: PromptData): string {
    return JSON.stringify(data, null, 2);
}

/**
 * 计算提示词完成度
 */
export function calculateCompleteness(data: PromptData): number {
    const fields = [
        data.taskGoal,
        data.aiRole,
        data.userRole,
        data.keyInfo,
        data.behaviorRules,
        data.deliveryFormat
    ];

    const filledFields = fields.filter((field) => field && field.trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
}

/**
 * 验证提示词数据是否完整
 */
export function validatePromptData(data: PromptData): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!data.taskGoal || data.taskGoal.trim().length === 0) {
        errors.push('任务目标不能为空');
    }

    if (!data.aiRole || data.aiRole.trim().length === 0) {
        errors.push('AI的角色不能为空');
    }

    if (!data.deliveryFormat || data.deliveryFormat.trim().length === 0) {
        errors.push('交付格式不能为空');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
