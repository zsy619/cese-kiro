# Context Engineering Six Elements (CESE)

<div align="center">

# 上下文工程六要素小工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/zsy619/cese-kiro.svg)](https://github.com/zsy619/cese-kiro/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/zsy619/cese-kiro.svg)](https://github.com/zsy619/cese-kiro/issues)

一个基于上下文工程六要素理论的智能提示词生成工具

[English](./README_EN.md) | 简体中文

</div>

## 📖 项目简介

**上下文工程六要素小工具 (Context Engineering Six Elements)** 是一个帮助用户构建高质量 AI 提示词的工具。基于上下文工程理论，本工具通过六个核心要素的结构化输入，自动生成专业、精准的提示词模板。

### 🎯 当前状态

- ✅ **前端开发**：MVP 阶段 100% 完成
- ⏳ **后端开发**：待开始
- ⏳ **数据库设计**：待开始
- ⏳ **AI 集成**：待开始

详细进度请查看 [项目进度报告](PROJECT_STATUS.md)

### 核心功能

- **🎯 六要素结构化输入**：基于任务目标、角色定义、关键信息、行为规则、交付格式和示例参考六大要素，引导用户系统化构建提示词
- **📝 智能提示词生成**：根据用户输入的六要素内容，自动生成结构化、专业化的提示词
- **💾 主题管理系统**：支持创建、保存、编辑和管理多个提示词主题，方便复用和迭代
- **🤖 本地 AI 集成**：集成 Ollama + DeepSeek 本地大模型，提供智能优化建议和内容补全
- **📊 历史记录追踪**：保存生成历史，支持版本对比和回溯
- **🔄 模板导入导出**：支持 Markdown 格式的模板导入导出，便于分享和协作

### 六要素说明

1. **任务目标 (Task Goal)**：明确要完成的具体任务
2. **AI 的角色 (AI Role)**：定义 AI 扮演的专业角色
3. **我的角色 (User Role)**：说明用户的身份和立场
4. **关键信息 (Key Information)**：提供任务相关的核心信息和约束条件
5. **行为规则 (Behavior Rules)**：规定 AI 的行为准则和输出要求
6. **交付格式 (Delivery Format)**：明确最终输出的格式和结构

## 🚀 技术栈

### 前端

- **React 18+**：现代化的前端框架
- **TypeScript**：类型安全的开发体验
- **Ant Design / Material-UI**：优雅的 UI 组件库
- **React Router**：路由管理
- **Axios**：HTTP 请求库
- **Monaco Editor**：代码编辑器（用于 Markdown 编辑）

### 后端

- **Hertz**：字节跳动开源的高性能 Go HTTP 框架
- **Go 1.20+**：高效的后端语言
- **GORM**：Go ORM 库
- **JWT**：用户认证
- **Swagger**：API 文档

### 数据库

- **MySQL 8.0+**：关系型数据库

### AI 集成

- **Ollama**：本地大模型运行环境
- **DeepSeek**：高性能开源大模型

## 📦 快速开始

### 方式一：源码启动（推荐开发使用）

#### 前置要求

- Node.js 18+
- Go 1.20+
- MySQL 8.0+
- Ollama（可选，用于 AI 功能）

#### 1. 克隆项目

```bash
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro
```

#### 2. 配置数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE cese_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出 MySQL
exit
```

#### 3. 启动后端服务

```bash
cd backend

# 安装依赖
go mod download

# 复制配置文件
cp config.example.yaml config.yaml

# 编辑配置文件，填入数据库连接信息
# vim config.yaml

# 运行数据库迁移
go run cmd/migrate/main.go

# 启动服务
go run cmd/server/main.go
```

后端服务将在 `http://localhost:8080` 启动

#### 4. 启动前端服务

```bash
# 新开一个终端
cd frontend

# 安装依赖
npm install
# 或使用 yarn
yarn install

# 启动开发服务器
npm run dev
# 或
yarn dev
```

前端服务将在 `http://localhost:3000` 启动

#### 5. 配置 Ollama（可选）

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 拉取 DeepSeek 模型
ollama pull deepseek-coder

# 启动 Ollama 服务
ollama serve
```

### 方式二：Docker 启动（推荐生产使用）

#### 前置要求

- Docker 20+
- Docker Compose 2+

#### 1. 克隆项目

```bash
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro
```

#### 2. 配置环境变量

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量（可选）
# vim .env
```

#### 3. 启动所有服务

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

服务访问地址：

- 前端：`http://localhost:3000`
- 后端 API：`http://localhost:8080`
- API 文档：`http://localhost:8080/swagger`

#### 4. 启动 Ollama（可选）

```bash
# 使用 Docker 运行 Ollama
docker run -d --name ollama \
  -p 11434:11434 \
  -v ollama:/root/.ollama \
  ollama/ollama

# 拉取模型
docker exec -it ollama ollama pull deepseek-coder
```

### 方式三：云函数部署（Serverless）

#### 部署到阿里云函数计算

##### 1. 安装 Serverless Devs

```bash
npm install -g @serverless-devs/s
```

##### 2. 配置阿里云账号

```bash
s config add

# 按提示输入 AccessKey ID 和 AccessKey Secret
```

##### 3. 部署后端

```bash
cd backend

# 编辑 s.yaml 配置文件
# vim s.yaml

# 部署
s deploy
```

##### 4. 部署前端到 OSS

```bash
cd frontend

# 构建生产版本
npm run build

# 上传到 OSS
s deploy
```

#### 部署到腾讯云 SCF

##### 1. 安装 Serverless Framework

```bash
npm install -g serverless
```

##### 2. 配置腾讯云账号

```bash
serverless login
```

##### 3. 部署

```bash
# 部署后端
cd backend
serverless deploy

# 部署前端
cd frontend
npm run build
serverless deploy
```

#### 部署到 AWS Lambda

##### 1. 安装 AWS CLI 和 SAM CLI

```bash
# macOS
brew install aws-cli aws-sam-cli

# 配置 AWS 凭证
aws configure
```

##### 2. 部署

```bash
# 构建
sam build

# 部署
sam deploy --guided
```

## 📚 使用指南

### 创建提示词主题

1. 点击"新建主题"按钮
2. 填写主题名称和描述
3. 依次填写六要素内容：
   - 任务目标：描述要完成的具体任务
   - AI 角色：定义 AI 的专业身份
   - 用户角色：说明你的身份
   - 关键信息：列出重要的背景信息
   - 行为规则：设定 AI 的行为准则
   - 交付格式：指定输出格式
4. 点击"生成提示词"
5. 预览并保存

### 管理主题

- **编辑**：点击主题卡片的编辑按钮
- **删除**：点击删除按钮（支持批量删除）
- **导出**：导出为 Markdown 文件
- **导入**：从 Markdown 文件导入主题

### AI 辅助功能

- **智能补全**：在输入时获取 AI 建议
- **内容优化**：点击优化按钮改进提示词质量
- **示例生成**：根据主题自动生成示例

## 🗂️ 项目结构

```
cese-kiro/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API 服务
│   │   ├── utils/           # 工具函数
│   │   └── App.tsx          # 主应用
│   ├── public/              # 静态资源
│   └── package.json
├── backend/                 # 后端项目
│   ├── cmd/                 # 命令行入口
│   ├── internal/            # 内部包
│   │   ├── handler/         # HTTP 处理器
│   │   ├── service/         # 业务逻辑
│   │   ├── model/           # 数据模型
│   │   └── repository/      # 数据访问层
│   ├── pkg/                 # 公共包
│   └── go.mod
├── docs/                    # 文档
├── docker-compose.yml       # Docker 编排
├── .env.example            # 环境变量示例
└── README.md               # 项目说明
```

## 🔧 配置说明

### 后端配置 (config.yaml)

```yaml
server:
  port: 8080
  mode: debug  # debug | release

database:
  host: localhost
  port: 3306
  username: root
  password: your_password
  database: cese_db
  charset: utf8mb4

ollama:
  enabled: true
  host: http://localhost:11434
  model: deepseek-coder
  timeout: 30s

jwt:
  secret: your_jwt_secret
  expire: 24h
```

### 前端配置 (.env)

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=上下文工程六要素小工具
VITE_OLLAMA_ENABLED=true
```

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 代码规范

在提交代码前，请确保：

- ✅ 所有注释使用中文
- ✅ 变量和函数名使用英文
- ✅ 使用 4 个空格缩进
- ✅ 遵循命名规范（PascalCase, camelCase, UPPER_SNAKE_CASE）
- ✅ 通过代码检查：`npm run check`

详细规范请查看：

- [完整代码规范](docs/CODE_STANDARDS.md)
- [快速参考指南](docs/CODE_STYLE_GUIDE.md)

### 提交流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某某功能'`)
4. 运行代码检查 (`npm run check`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 开启 Pull Request

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Hertz](https://github.com/cloudwego/hertz) - 字节跳动开源的高性能 Go 框架
- [Ollama](https://ollama.com/) - 本地大模型运行环境
- [DeepSeek](https://www.deepseek.com/) - 高性能开源大模型
- [React](https://react.dev/) - 前端框架

## 📮 联系方式

- 项目地址：[https://github.com/zsy619/cese-kiro](https://github.com/zsy619/cese-kiro)
- 问题反馈：[Issues](https://github.com/zsy619/cese-kiro/issues)

## 🗺️ 路线图

- [x] 基础六要素输入功能
- [x] 提示词生成和预览
- [x] 主题管理系统
- [ ] AI 智能优化建议
- [ ] 多语言支持
- [ ] 团队协作功能
- [ ] 提示词市场
- [ ] 浏览器插件

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**

Made with ❤️ by [zsy619](https://github.com/zsy619)

</div>
