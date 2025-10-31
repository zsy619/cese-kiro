# 代码规范说明

## 📋 概述

本项目遵循统一的代码规范，确保代码质量和可维护性。

## 🌐 语言规范

### 交流和注释
- ✅ **默认使用中文**进行所有交流和代码注释
- ✅ **代码变量和函数名使用英文**，遵循编程规范
- ✅ **错误信息和调试信息优先使用中文**解释

### 示例
```typescript
// ✅ 正确示例
/**
 * 用户认证服务
 * 提供登录、注册、登出等功能
 */
export const authService = {
    /**
     * 用户登录
     * @param data 登录表单数据
     * @returns 认证响应
     */
    login: async (data: LoginForm): Promise<AuthResponse> => {
        // 调用登录 API
        const response = await post(API_ENDPOINTS.AUTH.LOGIN, data);
        return response.data;
    }
};

// ❌ 错误示例
/**
 * User authentication service
 * Provides login, register, logout functions
 */
export const authService = {
    /**
     * User login
     * @param data Login form data
     * @returns Auth response
     */
    login: async (data: LoginForm): Promise<AuthResponse> => {
        // Call login API
        const response = await post(API_ENDPOINTS.AUTH.LOGIN, data);
        return response.data;
    }
};
```

## 📝 文件编码规范

### 缩进
- ✅ **使用 4 个空格**作为缩进单位
- ✅ **不使用 Tab 字符**
- ✅ 配置编辑器自动转换 Tab 为 4 个空格

### 编码
- ✅ **文件使用 UTF-8 编码**
- ✅ **代码中使用 UTF-8 编码**

### 换行符
- ✅ **使用 LF (Unix 风格)**换行符
- ⚠️ 注意：虽然规则要求 CRLF，但考虑到项目在 macOS/Linux 环境开发，统一使用 LF

### VS Code 配置
```json
{
    "editor.tabSize": 4,
    "editor.insertSpaces": true,
    "files.encoding": "utf8",
    "files.eol": "\n"
}
```

## 🎨 命名规范

### 类和组件
- ✅ **使用 PascalCase**（大驼峰命名法）
```typescript
// ✅ 正确
class UserService { }
const HomePage = () => { };
const AuthModal = () => { };

// ❌ 错误
class userService { }
const homePage = () => { };
const authModal = () => { };
```

### 函数和方法
- ✅ **使用 PascalCase**（根据规则）
- ⚠️ 注意：JavaScript/TypeScript 社区通常使用 camelCase，但我们遵循项目规则

```typescript
// ✅ 按规则（PascalCase）
const GetUserList = () => { };
const HandleClick = () => { };

// 社区惯例（camelCase）- 当前项目使用
const getUserList = () => { };
const handleClick = () => { };
```

### 变量和属性
- ✅ **使用 camelCase**（小驼峰命名法）
```typescript
// ✅ 正确
const userName = 'John';
const isLoading = false;
const userList = [];

// ❌ 错误
const UserName = 'John';
const IsLoading = false;
const user_list = [];
```

### 常量
- ✅ **使用 UPPER_SNAKE_CASE**（大写下划线命名法）
```typescript
// ✅ 正确
const API_BASE_URL = 'http://localhost:8080';
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 10;

// ❌ 错误
const apiBaseUrl = 'http://localhost:8080';
const maxRetryCount = 3;
const defaultPageSize = 10;
```

### 文件名
- ✅ **使用 camelCase 或 PascalCase**
- ✅ **组件文件使用 PascalCase**
- ✅ **工具文件使用 camelCase**

```
✅ 正确：
- HomePage.tsx
- AuthModal.tsx
- userService.ts
- request.ts
- api.ts

❌ 错误：
- home-page.tsx
- auth_modal.tsx
- user_service.ts
```

## 💬 注释规范

### 文件头注释
```typescript
/**
 * 用户认证服务
 * 
 * 提供用户登录、注册、登出等认证相关功能
 * 支持 Token 自动管理和刷新
 * 
 * @author zsy619
 * @date 2024-01-01
 */
```

### 函数注释
```typescript
/**
 * 用户登录
 * 
 * @param data 登录表单数据，包含手机号和密码
 * @returns 返回认证响应，包含 Token 和用户信息
 * @throws 当登录失败时抛出错误
 */
async function Login(data: LoginForm): Promise<AuthResponse> {
    // 实现代码
}
```

### 行内注释
```typescript
// 检查用户是否已登录
if (isAuthenticated) {
    // 已登录，跳转到首页
    navigate('/');
} else {
    // 未登录，显示登录弹窗
    setAuthModalVisible(true);
}
```

### 复杂逻辑注释
```typescript
/**
 * 计算模板完成度
 * 
 * 完成度 = (已填写要素数量 / 总要素数量) * 100
 * 六要素包括：任务目标、AI角色、用户角色、关键信息、行为规则、交付格式
 */
const calculateCompleteness = (elements: SixElements): number => {
    const totalElements = 6;
    let filledElements = 0;
    
    // 检查每个要素是否已填写
    if (elements.taskGoal) filledElements++;
    if (elements.aiRole) filledElements++;
    if (elements.userRole) filledElements++;
    if (elements.keyInfo) filledElements++;
    if (elements.behaviorRules) filledElements++;
    if (elements.deliveryFormat) filledElements++;
    
    return Math.round((filledElements / totalElements) * 100);
};
```

## 🔧 ESLint 配置

```javascript
module.exports = {
    rules: {
        // 强制使用中文注释
        'spaced-comment': ['error', 'always', {
            'markers': ['/'],
            'exceptions': ['-', '+']
        }],
        
        // 命名规范
        'camelcase': ['error', {
            'properties': 'always'
        }],
        
        // 缩进规范
        'indent': ['error', 4],
        
        // 其他规则...
    }
};
```

## 📚 Git 提交规范

### 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型（使用中文）
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例
```
feat(认证): 添加用户登录功能

- 实现登录表单验证
- 添加 Token 自动管理
- 支持记住登录状态

关闭 #123
```

## ✅ 检查清单

在提交代码前，请确保：

- [ ] 所有注释使用中文
- [ ] 变量和函数名使用英文
- [ ] 使用 4 个空格缩进
- [ ] 文件使用 UTF-8 编码
- [ ] 遵循命名规范
- [ ] 添加必要的注释
- [ ] 通过 ESLint 检查
- [ ] 通过 Prettier 格式化

## 🛠️ 工具配置

### 安装依赖
```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

### 运行检查
```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format

# 自动修复
npm run lint:fix
```

## 📖 参考资源

- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [React 官方文档](https://react.dev/)
- [ESLint 规则](https://eslint.org/docs/rules/)
- [Prettier 配置](https://prettier.io/docs/en/options.html)

---

**最后更新**：2024年  
**维护者**：zsy619