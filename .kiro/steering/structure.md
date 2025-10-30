# 项目结构

## 目录组织

```
cese-kiro/
├── .git/                    # Git 仓库
├── .kiro/                   # Kiro IDE 配置
├── .qoder/                  # 旧版工具配置
├── docs/                    # 文档和提示词
│   ├── A#项目初始化/         # 项目初始化文档
│   ├── B#前端/              # 前端文档
│   ├── C#后端/              # 后端文档（计划中）
│   ├── D#数据库/            # 数据库文档（计划中）
│   ├── E#测试/              # 测试文档（计划中）
│   └── F#部署/              # 部署文档（计划中）
├── frontend/                # React 前端应用
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── components/      # 可复用的 React 组件
│   │   ├── pages/           # 页面组件（计划中）
│   │   ├── services/        # API 服务层（计划中）
│   │   └── utils/           # 工具函数（计划中）
│   ├── package.json         # 依赖和脚本
│   └── tsconfig.json        # TypeScript 配置
└── README.md               # 项目文档
```

## 文档约定

### 提示词模板

- 位于 `docs/` 目录，使用带 `#` 前缀的中文文件夹名
- 遵循六要素结构：任务目标、AI的角色、我的角色、关键信息、行为规则、交付格式
- 模板文件：`docs/上下文工程六要素提示词模板.md`

### 命名模式

- 文档文件夹：`[字母]#[类别]`（例如：`B#前端`）
- 提示词文件：`[ID]-提示词-[描述].md`（例如：`B001-提示词-前端页面.md`）
- 双语 README 文件：`README.md`（中文）、`README_EN.md`（英文）

## 代码组织

### 前端结构

- **Components**：`src/components/` 中的可复用 UI 组件
- **Pages**：`src/pages/` 中的路由级组件
- **Services**：`src/services/` 中的 API 集成
- **Utils**：`src/utils/` 中的辅助函数
- **Styling**：CSS 模块和 styled-components

### 配置文件

- **TypeScript**：启用严格模式，React JSX 转换
- **包管理**：npm 配合锁文件
- **代码检查**：ESLint 配合 React 和 Prettier 配置
- **测试**：Jest 配合 React Testing Library

## 开发工作流

- 文档和面向用户的内容使用中文
- 代码注释和技术文档使用中文
- 遵循 React 函数式组件模式和 Hooks
- 全程保持 TypeScript 严格类型检查
