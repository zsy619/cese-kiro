describe('提示词生成器测试', () => {
    beforeEach(() => {
        cy.visit('/generator');
    });

    it('应该显示六要素输入表单', () => {
        cy.contains('任务目标').should('be.visible');
        cy.contains('AI的角色').should('be.visible');
        cy.contains('我的角色').should('be.visible');
        cy.contains('关键信息').should('be.visible');
        cy.contains('行为规则').should('be.visible');
        cy.contains('交付格式').should('be.visible');
    });

    it('应该能够输入和保存提示词', () => {
        // 输入主题信息
        cy.get('input[placeholder*="主题名称"]').type('测试提示词');

        // 输入六要素
        cy.contains('任务目标').parent().find('textarea').type('创建一个测试任务');
        cy.contains('AI的角色').parent().find('textarea').type('测试工程师');
        cy.contains('我的角色').parent().find('textarea').type('产品经理');
        cy.contains('关键信息').parent().find('textarea').type('测试关键信息');
        cy.contains('行为规则').parent().find('textarea').type('遵循测试规范');
        cy.contains('交付格式').parent().find('textarea').type('测试报告');

        // 保存
        cy.contains('保存').click();

        // 验证保存成功
        cy.contains('保存成功').should('be.visible');
    });

    it('应该显示实时预览', () => {
        cy.contains('任务目标').parent().find('textarea').type('测试任务');

        // 预览区域应该显示输入的内容
        cy.contains('测试任务').should('be.visible');
    });

    it('应该能够复制提示词', () => {
        // 输入内容
        cy.contains('任务目标').parent().find('textarea').type('测试任务');

        // 点击复制按钮
        cy.contains('复制').click();

        // 验证复制成功提示
        cy.contains('复制成功').should('be.visible');
    });

    it('应该能够导出提示词', () => {
        // 输入内容
        cy.contains('任务目标').parent().find('textarea').type('测试任务');

        // 点击导出按钮
        cy.contains('导出').click();

        // 验证下载
        cy.readFile('cypress/downloads/prompt.md').should('exist');
    });
});
