# CESE 后端服务 API 文档

## 概述

CESE（上下文工程六要素）后端服务提供用户管理和六要素管理的RESTful API接口。

- **基础URL**: `http://localhost:8080`
- **API版本**: v1
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

## 认证

除了用户注册和登录接口外，所有API都需要在请求头中包含JWT Token：

```
Authorization: Bearer <your-jwt-token>
```

## 统一响应格式

### 成功响应

```json
{
    "code": 200,
    "message": "成功",
    "data": {
        // 响应数据
    }
}
```

### 分页响应

```json
{
    "code": 200,
    "message": "查询成功",
    "data": [
        // 数据列表
    ],
    "total": 100,
    "page": 1,
    "size": 15
}
```

### 错误响应

```json
{
    "code": 400,
    "message": "参数错误"
}
```

## 错误码说明

| 错误码 | 说明 | HTTP状态码 |
|--------|------|------------|
| 200 | 成功 | 200 |
| 400 | 参数错误 | 400 |
| 401 | 未授权 | 401 |
| 403 | 禁止访问 | 403 |
| 404 | 资源不存在 | 404 |
| 500 | 内部错误 | 500 |
| 1001 | 用户已存在 | 400 |
| 1002 | 用户不存在 | 400 |
| 1003 | 密码错误 | 400 |
| 1004 | 密码强度不够 | 400 |
| 1005 | 手机号格式错误 | 400 |
| 2001 | 六要素不存在 | 404 |
| 2002 | 六要素已存在 | 400 |
| 2003 | 六要素参数错误 | 400 |
| 3001 | Token无效 | 401 |
| 3002 | Token过期 | 401 |
| 3003 | Token缺失 | 401 |

## API 接口

### 1. 用户管理

#### 1.1 用户注册

**接口地址**: `POST /api/v1/user/register`

**请求参数**:

```json
{
    "phone": "13800138000",
    "password": "Password123!"
}
```

**参数说明**:

- `phone` (string, required): 手机号码，11位数字
- `password` (string, required): 密码，8-16位，包含数字、大小写字母、特殊字符

**响应示例**:

```json
{
    "code": 200,
    "message": "注册成功",
    "data": {
        "id": 1,
        "phone": "13800138000",
        "created_at": "2024-10-31T10:00:00Z",
        "updated_at": "2024-10-31T10:00:00Z"
    }
}
```

#### 1.2 用户登录

**接口地址**: `POST /api/v1/user/login`

**请求参数**:

```json
{
    "phone": "13800138000",
    "password": "Password123!"
}
```

**参数说明**:

- `phone` (string, required): 手机号码
- `password` (string, required): 密码

**响应示例**:

```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "phone": "13800138000",
            "created_at": "2024-10-31T10:00:00Z",
            "updated_at": "2024-10-31T10:00:00Z"
        }
    }
}
```

#### 1.3 修改密码

**接口地址**: `PUT /api/v1/user/password`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
    "old_password": "Password123!",
    "new_password": "NewPassword456@"
}
```

**参数说明**:

- `old_password` (string, required): 旧密码
- `new_password` (string, required): 新密码，8-16位，包含数字、大小写字母、特殊字符

**响应示例**:

```json
{
    "code": 200,
    "message": "密码修改成功"
}
```

#### 1.4 获取用户信息

**接口地址**: `GET /api/v1/user/profile`

**请求头**: `Authorization: Bearer <token>`

**响应示例**:

```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "phone": "13800138000",
        "created_at": "2024-10-31T10:00:00Z",
        "updated_at": "2024-10-31T10:00:00Z"
    }
}
```

### 2. 六要素管理

#### 2.1 创建六要素

**接口地址**: `POST /api/v1/context-elements`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
    "subject": "AI助手开发",
    "task_goal": "开发一个智能客服助手",
    "ai_role": "高级AI工程师",
    "my_role": "产品经理",
    "key_info": "需要支持多轮对话",
    "behavior_rule": "保持专业和友好",
    "delivery_format": "技术方案文档"
}
```

**参数说明**:

- `subject` (string, required): 主题，最大255字符
- `task_goal` (string, optional): 任务目标，最大5000字符
- `ai_role` (string, optional): AI的角色，最大5000字符
- `my_role` (string, optional): 我的角色，最大5000字符
- `key_info` (string, optional): 关键信息，最大5000字符
- `behavior_rule` (string, optional): 行为规则，最大5000字符
- `delivery_format` (string, optional): 交付格式，最大5000字符

**响应示例**:

```json
{
    "code": 200,
    "message": "创建成功",
    "data": {
        "id": 1,
        "user_id": 1,
        "subject": "AI助手开发",
        "task_goal": "开发一个智能客服助手",
        "ai_role": "高级AI工程师",
        "my_role": "产品经理",
        "key_info": "需要支持多轮对话",
        "behavior_rule": "保持专业和友好",
        "delivery_format": "技术方案文档",
        "created_at": "2024-10-31T10:00:00Z",
        "updated_at": "2024-10-31T10:00:00Z"
    }
}
```

#### 2.2 查询六要素列表

**接口地址**: `GET /api/v1/context-elements`

**请求头**: `Authorization: Bearer <token>`

**查询参数**:

- `page` (int, optional): 页码，默认1
- `size` (int, optional): 每页数量，默认15，最大100
- `keyword` (string, optional): 关键词搜索，最大255字符
- `subject` (string, optional): 主题过滤，最大255字符
- `ai_role` (string, optional): AI角色过滤，最大255字符
- `my_role` (string, optional): 我的角色过滤，最大255字符
- `sort_by` (string, optional): 排序字段，可选值：created_at, updated_at, subject
- `sort_desc` (bool, optional): 是否倒序，默认true

**请求示例**:

```
GET /api/v1/context-elements?page=1&size=15&keyword=AI&subject=助手&sort_by=created_at&sort_desc=true
```

**响应示例**:

```json
{
    "code": 200,
    "message": "查询成功",
    "data": [
        {
            "id": 1,
            "user_id": 1,
            "subject": "AI助手开发",
            "task_goal": "开发一个智能客服助手",
            "ai_role": "高级AI工程师",
            "my_role": "产品经理",
            "key_info": "需要支持多轮对话",
            "behavior_rule": "保持专业和友好",
            "delivery_format": "技术方案文档",
            "created_at": "2024-10-31T10:00:00Z",
            "updated_at": "2024-10-31T10:00:00Z"
        }
    ],
    "total": 1,
    "page": 1,
    "size": 15
}
```

#### 2.3 获取单个六要素

**接口地址**: `GET /api/v1/context-elements/{id}`

**请求头**: `Authorization: Bearer <token>`

**路径参数**:

- `id` (int, required): 六要素ID

**响应示例**:

```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "id": 1,
        "user_id": 1,
        "subject": "AI助手开发",
        "task_goal": "开发一个智能客服助手",
        "ai_role": "高级AI工程师",
        "my_role": "产品经理",
        "key_info": "需要支持多轮对话",
        "behavior_rule": "保持专业和友好",
        "delivery_format": "技术方案文档",
        "created_at": "2024-10-31T10:00:00Z",
        "updated_at": "2024-10-31T10:00:00Z"
    }
}
```

#### 2.4 更新六要素

**接口地址**: `PUT /api/v1/context-elements/{id}`

**请求头**: `Authorization: Bearer <token>`

**路径参数**:

- `id` (int, required): 六要素ID

**请求参数**:

```json
{
    "subject": "AI助手开发v2",
    "task_goal": "开发一个更智能的客服助手",
    "ai_role": "资深AI工程师",
    "my_role": "产品经理",
    "key_info": "需要支持多轮对话和情感分析",
    "behavior_rule": "保持专业、友好和同理心",
    "delivery_format": "详细技术方案文档"
}
```

**参数说明**: 所有参数都是可选的，只更新提供的字段

**响应示例**:

```json
{
    "code": 200,
    "message": "更新成功",
    "data": {
        "id": 1,
        "user_id": 1,
        "subject": "AI助手开发v2",
        "task_goal": "开发一个更智能的客服助手",
        "ai_role": "资深AI工程师",
        "my_role": "产品经理",
        "key_info": "需要支持多轮对话和情感分析",
        "behavior_rule": "保持专业、友好和同理心",
        "delivery_format": "详细技术方案文档",
        "created_at": "2024-10-31T10:00:00Z",
        "updated_at": "2024-10-31T11:00:00Z"
    }
}
```

#### 2.5 删除六要素

**接口地址**: `DELETE /api/v1/context-elements/{id}`

**请求头**: `Authorization: Bearer <token>`

**路径参数**:

- `id` (int, required): 六要素ID

**响应示例**:

```json
{
    "code": 200,
    "message": "删除成功"
}
```

### 3. 系统接口

#### 3.1 健康检查

**接口地址**: `GET /health`

**响应示例**:

```json
{
    "status": "ok",
    "message": "CESE Backend Service is running"
}
```

#### 3.2 服务信息

**接口地址**: `GET /`

**响应示例**:

```json
{
    "name": "CESE Backend API",
    "version": "1.0.0",
    "message": "上下文工程六要素工具后端服务"
}
```

## 使用示例

### cURL 示例

#### 用户注册

```bash
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "Password123!"
  }'
```

#### 用户登录

```bash
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "13800138000",
    "password": "Password123!"
  }'
```

#### 创建六要素

```bash
curl -X POST http://localhost:8080/api/v1/context-elements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subject": "AI助手开发",
    "task_goal": "开发一个智能客服助手",
    "ai_role": "高级AI工程师",
    "my_role": "产品经理",
    "key_info": "需要支持多轮对话",
    "behavior_rule": "保持专业和友好",
    "delivery_format": "技术方案文档"
  }'
```

#### 查询六要素列表

```bash
curl -X GET "http://localhost:8080/api/v1/context-elements?page=1&size=10&keyword=AI" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript 示例

```javascript
// 用户登录
const login = async (phone, password) => {
  const response = await fetch('http://localhost:8080/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, password }),
  });

  const result = await response.json();
  if (result.code === 200) {
    localStorage.setItem('token', result.data.token);
    return result.data;
  }
  throw new Error(result.message);
};

// 创建六要素
const createContextElement = async (elementData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/v1/context-elements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(elementData),
  });

  const result = await response.json();
  if (result.code === 200) {
    return result.data;
  }
  throw new Error(result.message);
};

// 查询六要素列表
const getContextElements = async (params = {}) => {
  const token = localStorage.getItem('token');
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`http://localhost:8080/api/v1/context-elements?${queryString}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (result.code === 200) {
    return result;
  }
  throw new Error(result.message);
};
```

## 性能指标

### 响应时间

- 用户登录: < 100ms
- 六要素查询: < 50ms
- 六要素创建: < 200ms
- 六要素更新: < 150ms

### 并发能力

- 用户登录: 300+ QPS
- 六要素查询: 500+ QPS
- 六要素创建: 200+ QPS

### 可用性

- 服务可用性: 99.9%
- 响应成功率: 99.5%

## 版本历史

### v1.0.0 (2024-10-31)

- 初始版本发布
- 用户管理功能
- 六要素CRUD功能
- JWT认证
- 分页查询
- 搜索过滤

## 联系方式

如有问题或建议，请联系开发团队。
