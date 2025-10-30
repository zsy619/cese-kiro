/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * 自定义命令：登录
             * @example cy.login('13800138000', 'password123')
             */
            login(phone: string, password: string): Chainable<void>;

            /**
             * 自定义命令：模拟登录状态
             * @example cy.mockLogin()
             */
            mockLogin(): Chainable<void>;

            /**
             * 自定义命令：填写提示词表单
             * @example cy.fillPromptForm(data)
             */
            fillPromptForm(data: {
                taskGoal: string;
                aiRole: string;
                userRole: string;
                keyInfo: string;
                behaviorRules: string;
                deliveryFormat: string;
            }): Chainable<void>;
        }
    }
}

// 登录命令
Cypress.Commands.add('login', (phone: string, password: string) => {
    cy.visit('/');
    cy.contains('登录').click();
    cy.get('input[placeholder*="手机号"]').type(phone);
    cy.get('input[type="password"]').type(password);
    cy.contains('登录').last().click();
    cy.wait(1000);
});

// 模拟登录状态
Cypress.Commands.add('mockLogin', () => {
    cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        win.localStorage.setItem(
            'user_info',
            JSON.stringify({
                id: 1,
                phone: '13800138000',
                nickname: 'Cypress测试用户',
                avatar: ''
            })
        );
    });
});

// 填写提示词表单
Cypress.Commands.add('fillPromptForm', (data) => {
    cy.visit('/generator');

    if (data.taskGoal) {
        cy.contains('任务目标').parent().find('textarea').clear().type(data.taskGoal);
    }
    if (data.aiRole) {
        cy.contains('AI的角色').parent().find('textarea').clear().type(data.aiRole);
    }
    if (data.userRole) {
        cy.contains('我的角色').parent().find('textarea').clear().type(data.userRole);
    }
    if (data.keyInfo) {
        cy.contains('关键信息').parent().find('textarea').clear().type(data.keyInfo);
    }
    if (data.behaviorRules) {
        cy.contains('行为规则').parent().find('textarea').clear().type(data.behaviorRules);
    }
    if (data.deliveryFormat) {
        cy.contains('交付格式').parent().find('textarea').clear().type(data.deliveryFormat);
    }
});

export { };
