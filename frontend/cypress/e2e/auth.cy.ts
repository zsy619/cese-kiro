describe('用户认证测试', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe('注册流程', () => {
        it('应该显示注册弹窗', () => {
            cy.contains('注册').click();
            cy.contains('用户注册').should('be.visible');
        });

        it('应该验证手机号格式', () => {
            cy.contains('注册').click();

            // 输入无效手机号
            cy.get('input[placeholder*="手机号"]').type('123');
            cy.contains('提交').click();

            // 应该显示错误提示
            cy.contains('手机号格式不正确').should('be.visible');
        });

        it('应该验证密码强度', () => {
            cy.contains('注册').click();

            // 输入弱密码
            cy.get('input[placeholder*="手机号"]').type('13800138000');
            cy.get('input[type="password"]').first().type('123');

            // 应该显示密码强度提示
            cy.contains('密码强度').should('be.visible');
        });

        it('应该验证密码一致性', () => {
            cy.contains('注册').click();

            cy.get('input[placeholder*="手机号"]').type('13800138000');
            cy.get('input[type="password"]').first().type('Test123456');
            cy.get('input[type="password"]').last().type('Test123457');

            cy.contains('提交').click();

            // 应该显示密码不一致提示
            cy.contains('两次密码不一致').should('be.visible');
        });
    });

    describe('登录流程', () => {
        it('应该显示登录弹窗', () => {
            cy.contains('登录').click();
            cy.contains('用户登录').should('be.visible');
        });

        it('应该能够切换到注册', () => {
            cy.contains('登录').click();
            cy.contains('立即注册').click();
            cy.contains('用户注册').should('be.visible');
        });

        it('应该验证登录表单', () => {
            cy.contains('登录').click();

            // 不输入任何内容直接提交
            cy.contains('登录').last().click();

            // 应该显示验证错误
            cy.contains('请输入').should('be.visible');
        });
    });

    describe('登录状态', () => {
        it('登录后应该显示用户信息', () => {
            // 模拟登录
            cy.window().then((win) => {
                win.localStorage.setItem(
                    'auth_token',
                    'mock_token'
                );
                win.localStorage.setItem(
                    'user_info',
                    JSON.stringify({
                        id: 1,
                        phone: '13800138000',
                        nickname: '测试用户'
                    })
                );
            });

            cy.reload();

            // 应该显示用户昵称
            cy.contains('测试用户').should('be.visible');
        });

        it('应该能够退出登录', () => {
            // 模拟登录状态
            cy.window().then((win) => {
                win.localStorage.setItem('auth_token', 'mock_token');
            });

            cy.reload();

            // 点击用户头像
            cy.get('[data-testid="user-avatar"]').click();

            // 点击退出登录
            cy.contains('退出登录').click();

            // 应该显示登录按钮
            cy.contains('登录').should('be.visible');
        });
    });
});
