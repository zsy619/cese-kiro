# 前端开发服务器启动指南

## 快速启动

### 方式一：使用脚本启动（推荐）

#### macOS/Linux
```bash
./start-dev.sh
```

#### Windows
```cmd
start-dev.bat
```

### 方式二：使用 npm 命令

#### 启动开发服务器（端口 3100）
```bash
npm run dev
```

#### 启动开发服务器（默认端口 3000）
```bash
npm start
```

#### 启动开发服务器（指定端口 3100，不自动打开浏览器）
```bash
npm run start:3100
```

## 环境配置

### 环境变量文件 (.env)
```env
# 开发服务器配置
PORT=3100

# API 配置
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_APP_TITLE=上下文工程六要素小工具
REACT_APP_OLLAMA_ENABLED=true

# 开发环境配置
GENERATE_SOURCEMAP=true
FAST_REFRESH=true
```

### 手动设置环境变量

#### macOS/Linux
```bash
export PORT=3100
export REACT_APP_API_BASE_URL=http://localhost:8080
npm start
```

#### Windows (CMD)
```cmd
set PORT=3100
set REACT_APP_API_BASE_URL=http://localhost:8080
npm start
```

#### Windows (PowerShell)
```powershell
$env:PORT=3100
$env:REACT_APP_API_BASE_URL="http://localhost:8080"
npm start
```

## 访问地址

- **前端应用**: http://localhost:3100
- **后端 API**: http://localhost:8080 (计划中)
- **API 文档**: http://localhost:8080/swagger (计划中)

## 开发工具

### 浏览器扩展
- React Developer Tools
- Redux DevTools (如果使用 Redux)

### VS Code 扩展推荐
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## 故障排除

### 问题：react-scripts 命令未找到
```bash
# 重新安装 react-scripts
npm install react-scripts@5.0.1

# 或者删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题：端口被占用
```bash
# 查找占用端口的进程
lsof -ti:3100

# 杀死占用端口的进程
kill -9 $(lsof -ti:3100)

# 或者使用不同端口
PORT=3101 npm start
```

### 问题：依赖版本冲突
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题：TypeScript 编译错误
```bash
# 检查 TypeScript 配置
npx tsc --noEmit

# 重启 TypeScript 服务（VS Code）
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── services/        # API 服务
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 主应用组件
│   └── index.tsx        # 入口文件
├── .env                 # 环境变量
├── package.json         # 依赖配置
├── tsconfig.json        # TypeScript 配置
├── start-dev.sh         # Linux/macOS 启动脚本
├── start-dev.bat        # Windows 启动脚本
└── README-DEV.md        # 开发指南
```

## 开发命令

```bash
npm start              # 启动开发服务器（默认端口）
npm run dev            # 启动开发服务器（端口 3100）
npm run build          # 构建生产版本
npm test               # 运行测试
npm run eject          # 弹出 Create React App 配置（不可逆）
```

## 技术栈

- **React 19.2.0** - 前端框架
- **TypeScript 4.9.5** - 类型安全
- **Ant Design 5.27.6** - UI 组件库
- **React Router 7.9.4** - 路由管理
- **Axios 1.13.0** - HTTP 请求
- **Monaco Editor 4.7.0** - 代码编辑器
- **Styled Components 6.1.19** - CSS-in-JS
- **React Markdown 10.1.0** - Markdown 渲染

## 下一步

1. 完成基础组件开发
2. 实现六要素输入表单
3. 集成 Monaco Editor
4. 添加主题管理功能
5. 对接后端 API