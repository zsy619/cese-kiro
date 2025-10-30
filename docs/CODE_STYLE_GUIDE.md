# 代码风格快速参考

## 🎯 核心原则

1. **中文注释，英文代码**
2. **4 个空格缩进**
3. **UTF-8 编码**
4. **统一命名规范**

## 📝 命名速查表

| 类型 | 规范 | 示例 | 说明 |
|------|------|------|------|
| 组件 | PascalCase | `HomePage`, `AuthModal` | React 组件 |
| 类 | PascalCase | `UserService`, `ApiClient` | 类名 |
| 函数 | camelCase | `getUserList`, `handleClick` | 普通函数 |
| 变量 | camelCase | `userName`, `isLoading` | 变量和属性 |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY` | 常量 |
| 接口 | PascalCase | `UserInfo`, `ApiResponse` | TypeScript 接口 |
| 类型 | PascalCase | `LoginForm`, `Template` | TypeScript 类型 |
| 枚举 | PascalCase | `UserRole`, `ApiStatus` | 枚举类型 |
| 文件名 | PascalCase/camelCase | `HomePage.tsx`, `request.ts` | 组件用 PascalCase |

## 💬 注释模板

### 文件头

```typescript
/**
 * 用户认证服务
 *
 * 提供登录、注册、登出等功能
 *
 * @author zsy619
 * @date 2024-01-01
 */
```

### 函数注释

```typescript
/**
 * 获取用户列表
 *
 * @param params 查询参数
 * @param params.page 页码
 * @param params.pageSize 每页数量
 * @returns 用户列表和总数
 */
const getUserList = async (params: QueryParams): Promise<UserListResponse> => {
    // 实现代码
};
```

### 复杂逻辑

```typescript
// 计算模板完成度
// 公式：(已填写要素数 / 总要素数) * 100
const completeness = (filledCount / totalCount) * 100;
```

### TODO 注释

```typescript
// TODO: 实现用户权限检查
// FIXME: 修复登录状态丢失问题
// NOTE: 这里需要注意性能问题
```

## 🎨 代码格式示例

### React 组件

```typescript
/**
 * 首页组件
 *
 * 展示项目介绍和核心功能
 */
const HomePage: React.FC = () => {
    // 状态定义
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);

    // 副作用
    useEffect(() => {
        // 加载数据
        loadData();
    }, []);

    // 事件处理
    const handleClick = () => {
        // 处理点击事件
        console.log('按钮被点击');
    };

    // 渲染
    return (
        <div className='home-page'>
            <h1>首页</h1>
            <Button onClick={handleClick}>点击</Button>
        </div>
    );
};

export default HomePage;
```

### API 服务

```typescript
/**
 * 模板 API 服务
 */
export const templateApi = {
    /**
     * 获取模板列表
     *
     * @param params 查询参数
     * @returns 模板列表
     */
    getList: async (params?: QueryParams): Promise<Template[]> => {
        try {
            // 调用 API
            const response = await get<Template[]>(
                API_ENDPOINTS.TEMPLATE.LIST,
                params
            );

            // 返回数据
            return response.data;
        } catch (error) {
            // 错误处理
            console.error('获取模板列表失败:', error);
            throw error;
        }
    }
};
```

### 工具函数

```typescript
/**
 * 格式化日期
 *
 * @param date 日期对象或时间戳
 * @param format 格式字符串，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
    date: Date | number,
    format: string = 'YYYY-MM-DD'
): string => {
    // 转换为 Date 对象
    const d = typeof date === 'number' ? new Date(date) : date;

    // 格式化
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    // 返回结果
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
};
```

## 🔧 常用命令

```bash
# 代码检查
npm run lint              # 运行 ESLint
npm run lint:fix          # 自动修复 ESLint 问题

# 代码格式化
npm run format            # 格式化所有代码
npm run format:check      # 检查格式是否正确

# 类型检查
npm run type-check        # TypeScript 类型检查

# 完整检查
npm run check             # 运行所有检查
```

## ✅ 提交前检查清单

- [ ] 所有注释使用中文
- [ ] 变量和函数名使用英文
- [ ] 使用 4 个空格缩进
- [ ] 通过 ESLint 检查
- [ ] 通过 TypeScript 类型检查
- [ ] 通过 Prettier 格式化
- [ ] 添加必要的注释
- [ ] 测试功能正常

## 🚫 常见错误

### ❌ 错误示例

```typescript
// 使用英文注释
// Get user list
const getUserList = () => {};

// 使用下划线命名变量
const user_name = 'John';

// 使用 Tab 缩进
function test() {
 return true;  // 这里是 Tab
}

// 常量使用小写
const apiBaseUrl = 'http://localhost:8080';
```

### ✅ 正确示例

```typescript
// 使用中文注释
// 获取用户列表
const getUserList = () => {};

// 使用驼峰命名变量
const userName = 'John';

// 使用 4 个空格缩进
function test() {
    return true;  // 这里是 4 个空格
}

// 常量使用大写下划线
const API_BASE_URL = 'http://localhost:8080';
```

## 📚 更多资源

- [完整代码规范文档](./CODE_STANDARDS.md)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [React 官方文档](https://react.dev/)
- [ESLint 规则](https://eslint.org/docs/rules/)

---

**快速记忆口诀**：

- 注释中文，代码英文
- 四格缩进，UTF-8 编
- 驼峰命名，常量大写
- 规范统一，质量保证
