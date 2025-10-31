-- CESE 上下文工程六要素工具数据库初始化脚本
-- 创建时间: 2024-10-31
-- 描述: 初始化用户表和六要素表

-- 删除已存在的表（如果存在）
DROP TABLE IF EXISTS cese_context_element;
DROP TABLE IF EXISTS cese_user;

-- 创建用户表
CREATE TABLE cese_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    phone VARCHAR(11) NOT NULL UNIQUE COMMENT '手机号码',
    password VARCHAR(255) NOT NULL COMMENT '加密密码',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建上下文工程六要素表
CREATE TABLE cese_context_element (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '六要素ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    subject VARCHAR(255) NOT NULL COMMENT '主题',
    task_goal TEXT COMMENT '任务目标',
    ai_role TEXT COMMENT 'AI的角色',
    my_role TEXT COMMENT '我的角色',
    key_info TEXT COMMENT '关键信息',
    behavior_rule TEXT COMMENT '行为规则',
    delivery_format TEXT COMMENT '交付格式',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (user_id),
    INDEX idx_subject (subject),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_search (subject, task_goal, ai_role, my_role, key_info, behavior_rule, delivery_format),
    FOREIGN KEY (user_id) REFERENCES cese_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='上下文工程六要素表';

-- 插入测试数据
INSERT INTO cese_user (phone, password) VALUES
('13800138000', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXgwHcgRubJ5.jHK6zBiLqjzJm6'); -- 密码: Password123!

INSERT INTO cese_context_element (user_id, subject, task_goal, ai_role, my_role, key_info, behavior_rule, delivery_format) VALUES
(1, 'AI助手开发', '开发一个智能客服助手', '高级AI工程师', '产品经理', '需要支持多轮对话', '保持专业和友好', '技术方案文档'),
(1, '网站优化', '提升网站性能和用户体验', 'Web性能专家', '前端开发者', '当前网站加载速度较慢', '基于数据分析给出建议', '优化方案和实施计划'),
(1, '数据分析', '分析用户行为数据', '数据科学家', '运营经理', '用户留存率下降', '使用统计学方法分析', 'Excel报告和可视化图表');

-- 显示表结构
DESCRIBE cese_user;
DESCRIBE cese_context_element;

-- 显示插入的数据
SELECT COUNT(*) as user_count FROM cese_user;
SELECT COUNT(*) as element_count FROM cese_context_element;
