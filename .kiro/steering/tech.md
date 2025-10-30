# 技术栈

## 前端

- **React 18+** 配合 TypeScript
- **Ant Design** 用于 UI 组件
- **Monaco Editor** 用于 Markdown 编辑
- **React Router** 用于导航
- **Axios** 用于 HTTP 请求
- **Styled Components** 用于样式
- **Create React App** 作为构建系统

## 后端（计划中）

- **Hertz**（字节跳动 Go HTTP 框架）
- **Go 1.20+**
- **GORM** 用于数据库 ORM
- **JWT** 用于身份验证
- **Swagger** 用于 API 文档

## 数据库（计划中）

- **MySQL 8.0+**

## AI 集成（计划中）

- **Ollama** 用于本地模型运行时
- **DeepSeek** 模型用于 AI 功能

## 开发命令

### 前端开发

```bash
cd frontend
npm install          # 安装依赖
npm start           # 启动开发服务器（默认端口 3000）
npm run build       # 生产环境构建
npm test            # 运行测试
```

### 项目结构命令

```bash
# 克隆和设置
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro

# 仅前端（当前状态）
cd frontend && npm install && npm start
```

## 构建系统

- 使用 Create React App 配合 TypeScript 模板
- ESLint 和 Prettier 用于代码质量
- Jest 作为测试框架
- 默认开发端口：3000（根据文档可配置为 3100）
