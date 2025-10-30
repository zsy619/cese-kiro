describe('首页测试', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('应该正确显示页面标题', () => {
        cy.contains('上下文工程六要素').should('be.visible');
    });

    it('应该显示六要素卡片', () => {
        cy.contains('任务目标').should('be.visible');
        cy.contains('AI的角色').should('be.visible');
        cy.contains('我的角色').should('be.visible');
        cy.contains('关键信息').should('be.visible');
        cy.contains('行为规则').should('be.visible');
        cy.contains('交付格式').should('be.visible');
    });

    it('应该显示核心功能区域', () => {
        cy.contains('核心功能').should('be.visible');
        cy.contains('智能提示词生成').should('be.visible');
        cy.contains('主题管理系统').should('be.visible');
    });

    it('点击立即体验按钮应该导航到生成器页面', () => {
        cy.contains('立即体验').first().click();
        cy.url().should('include', '/generator');
    });

    it('点击查看模板按钮应该导航到模板页面', () => {
        cy.contains('查看模板').click();
        cy.url().should('include', '/templates');
    });

    it('应该显示统计数据', () => {
        cy.contains('用户数量').should('be.visible');
        cy.contains('生成模板数').should('be.visible');
        cy.contains('活跃用户数').should('be.visible');
    });

    it('应该响应式显示', () => {
        // 测试移动端视图
        cy.viewport('iphone-x');
        cy.contains('上下文工程六要素').should('be.visible');

        // 测试平板视图
        cy.viewport('ipad-2');
        cy.contains('上下文工程六要素').should('be.visible');

        // 测试桌面视图
        cy.viewport(1920, 1080);
        cy.contains('上下文工程六要素').should('be.visible');
    });
});
