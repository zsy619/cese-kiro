# CESE 后端服务开发 ToDo List

## 项目概述

基于 Golang + Hertz + MySQL + GORM 构建的上下文工程六要素工具后端服务

## 技术栈

- **语言**: Golang 1.20+
- **Web框架**: Hertz (字节跳动)
- **数据库**: MySQL 8.0+
- **ORM**: GORM
- **认证**: JWT
- **文档**: Swagger
- **容器**: Docker

## 开发任务清单

### 🏗️ 1. 项目基础架构搭建

#### 1.1 项目初始化

- [x] 创建 `backend` 目录
- [x] 初始化 Go Module (`go mod init cese-backend`)
- [x] 安装核心依赖包
  - [x] Hertz Web框架
  - [x] GORM ORM框架
  - [x] MySQL驱动
  - [x] JWT认证
  - [x] 密码加密 (bcrypt)
  - [x] 参数验证 (validator)
  - [x] 配置管理 (viper)
  - [x] 日志处理 (logrus)

#### 1.2 项目目录结构

```
backend/
├── cmd/
│   └── main.go                 # 应用入口
├── internal/
│   ├── config/                 # 配置管理
│   ├── handler/                # HTTP处理器
│   ├── service/                # 业务逻辑层
│   ├── repository/             # 数据访问层
│   ├── model/                  # 数据模型
│   ├── middleware/             # 中间件
│   ├── utils/                  # 工具函数
│   └── types/                  # 类型定义
├── pkg/
│   ├── response/               # 统一响应格式
│   ├── validator/              # 参数验证
│   └── logger/                 # 日志工具
├── docker/
│   └── init.sql               # 数据库初始化脚本
├── configs/
│   ├── config.yaml            # 配置文件
│   └── config.example.yaml    # 配置示例
├── docs/                      # API文档
├── go.mod
├── go.sum
├── Dockerfile
└── README.md
```

#### 1.3 配置管理

- [x] 创建配置结构体
- [x] 支持多环境配置 (dev/staging/prod)
- [x] 数据库连接配置
- [x] JWT密钥配置
- [x] 服务端口配置
- [x] 日志级别配置

### 🗄️ 2. 数据库设计与初始化

#### 2.1 数据库表设计

- [x] 创建 `docker/init.sql` 文件
- [x] 设计用户表 (`cese_user`)
- [x] 设计六要素表 (`cese_context_element`)

#### 2.2 用户表 (cese_user)

```sql
CREATE TABLE cese_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    phone VARCHAR(11) NOT NULL UNIQUE COMMENT '手机号码',
    password VARCHAR(255) NOT NULL COMMENT '加密密码',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### 2.3 六要素表 (cese_context_element)

```sql
CREATE TABLE cese_context_element (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
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
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES cese_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='上下文工程六要素表';
```

### 🔧 3. 核心组件开发

#### 3.1 统一响应格式

- [x] 定义响应结构体
- [x] 成功响应封装
- [x] 错误响应封装
- [x] 分页响应封装

```go
type Response struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}

type PageResponse struct {
    Code    int         `json:"code"`
    Message string      `json:"message"`
    Data    interface{} `json:"data"`
    Total   int64       `json:"total"`
    Page    int         `json:"page"`
    Size    int         `json:"size"`
}
```

#### 3.2 错误处理

- [x] 定义错误码常量
- [x] 自定义错误类型
- [x] 全局错误处理中间件

#### 3.3 日志处理

- [x] 配置日志格式
- [x] 请求日志中间件
- [x] 错误日志记录
- [x] 日志文件轮转

#### 3.4 JWT认证中间件

- [x] JWT生成和验证
- [x] 认证中间件
- [x] 用户信息提取

### 👤 4. 用户模块开发

#### 4.1 用户模型定义

- [x] 用户结构体定义
- [x] GORM模型标签
- [x] 密码加密方法
- [x] 密码验证方法

#### 4.2 用户参数验证

- [x] 手机号码格式验证
- [x] 密码强度验证 (8-16位，包含数字、大小写字母、特殊字符)
- [x] 注册参数验证
- [x] 登录参数验证
- [x] 修改密码参数验证

#### 4.3 用户Repository层

- [x] 根据手机号查询用户
- [x] 创建用户
- [x] 更新用户密码
- [x] 用户存在性检查

#### 4.4 用户Service层

- [x] 用户注册业务逻辑
- [x] 用户登录业务逻辑
- [x] 修改密码业务逻辑
- [x] 获取用户信息业务逻辑
- [x] JWT Token生成

#### 4.5 用户Handler层

- [x] POST `/api/v1/user/register` - 用户注册
- [x] POST `/api/v1/user/login` - 用户登录
- [x] PUT `/api/v1/user/password` - 修改密码
- [x] GET `/api/v1/user/profile` - 获取用户信息

### 📝 5. 六要素模块开发

#### 5.1 六要素模型定义

- [x] 六要素结构体定义
- [x] GORM模型标签
- [x] 关联用户模型

#### 5.2 六要素参数验证

- [x] 创建参数验证
- [x] 更新参数验证
- [x] 查询参数验证

#### 5.3 六要素Repository层

- [x] 创建六要素记录
- [x] 根据ID查询六要素
- [x] 根据用户ID查询六要素列表
- [x] 模糊搜索六要素
- [x] 更新六要素记录
- [x] 删除六要素记录
- [x] 分页查询实现

#### 5.4 六要素Service层

- [x] 创建六要素业务逻辑
- [x] 查询六要素业务逻辑
- [x] 更新六要素业务逻辑
- [x] 删除六要素业务逻辑
- [x] 搜索六要素业务逻辑

#### 5.5 六要素Handler层

- [x] POST `/api/v1/context-elements` - 创建六要素
- [x] GET `/api/v1/context-elements` - 查询六要素列表
- [x] GET `/api/v1/context-elements/:id` - 获取单个六要素
- [x] PUT `/api/v1/context-elements/:id` - 更新六要素
- [x] DELETE `/api/v1/context-elements/:id` - 删除六要素

### 🔒 6. 安全与认证

#### 6.1 密码安全

- [x] 使用bcrypt加密密码
- [x] 密码强度验证
- [x] 防止密码明文传输

#### 6.2 JWT认证

- [x] JWT Token生成
- [x] JWT Token验证
- [x] Token过期处理
- [x] 刷新Token机制

#### 6.3 API安全

- [x] 认证中间件
- [x] 权限验证
- [x] 防止SQL注入
- [x] 请求频率限制

### 📊 7. 数据库操作

#### 7.1 GORM配置

- [x] 数据库连接池配置
- [x] 自动迁移配置
- [x] 日志配置
- [x] 性能优化配置

#### 7.2 查询优化

- [x] 索引优化
- [x] 分页查询优化
- [x] 模糊搜索优化
- [x] 关联查询优化

### 🧪 8. 测试

#### 8.1 单元测试

- [x] 用户模块测试
- [x] 六要素模块测试
- [x] 工具函数测试
- [x] 中间件测试

#### 8.2 集成测试

- [x] API接口测试
- [x] 数据库操作测试
- [x] 认证流程测试

#### 8.3 性能测试

- [x] 接口性能测试
- [x] 数据库查询性能测试
- [x] 并发测试

### 📚 9. 文档

#### 9.1 API文档

- [x] Swagger文档生成
- [x] 接口说明文档
- [x] 参数说明文档
- [x] 错误码文档

#### 9.2 开发文档

- [x] 项目README
- [x] 部署文档
- [x] 开发环境搭建文档
- [x] 数据库设计文档

### 🐳 10. 容器化部署

#### 10.1 Docker配置

- [x] Dockerfile编写
- [x] docker-compose配置
- [x] 多阶段构建优化

#### 10.2 环境配置

- [x] 开发环境配置
- [x] 测试环境配置
- [x] 生产环境配置

## API接口设计

### 用户相关接口

#### 1. 用户注册

```
POST /api/v1/user/register
Content-Type: application/json

Request:
{
    "phone": "13800138000",
    "password": "Password123!"
}

Response:
{
    "code": 200,
    "message": "注册成功",
    "data": {
        "id": 1,
        "phone": "13800138000",
        "created_at": "2024-10-31T10:00:00Z"
    }
}
```

#### 2. 用户登录

```
POST /api/v1/user/login
Content-Type: application/json

Request:
{
    "phone": "13800138000",
    "password": "Password123!"
}

Response:
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "phone": "13800138000"
        }
    }
}
```

#### 3. 修改密码

```
PUT /api/v1/user/password
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
    "old_password": "Password123!",
    "new_password": "NewPassword456@"
}

Response:
{
    "code": 200,
    "message": "密码修改成功"
}
```

#### 4. 获取用户信息

```
GET /api/v1/user/profile
Authorization: Bearer <token>

Response:
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

### 六要素相关接口

#### 1. 创建六要素

```
POST /api/v1/context-elements
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
    "subject": "AI助手开发",
    "task_goal": "开发一个智能客服助手",
    "ai_role": "高级AI工程师",
    "my_role": "产品经理",
    "key_info": "需要支持多轮对话",
    "behavior_rule": "保持专业和友好",
    "delivery_format": "技术方案文档"
}

Response:
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

#### 2. 查询六要素列表

```
GET /api/v1/context-elements?page=1&size=15&keyword=AI&subject=助手
Authorization: Bearer <token>

Response:
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

#### 3. 获取单个六要素

```
GET /api/v1/context-elements/1
Authorization: Bearer <token>

Response:
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

#### 4. 更新六要素

```
PUT /api/v1/context-elements/1
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
    "subject": "AI助手开发v2",
    "task_goal": "开发一个更智能的客服助手",
    "ai_role": "资深AI工程师",
    "my_role": "产品经理",
    "key_info": "需要支持多轮对话和情感分析",
    "behavior_rule": "保持专业、友好和同理心",
    "delivery_format": "详细技术方案文档"
}

Response:
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

#### 5. 删除六要素

```
DELETE /api/v1/context-elements/1
Authorization: Bearer <token>

Response:
{
    "code": 200,
    "message": "删除成功"
}
```

## 错误码定义

```go
const (
    // 通用错误码
    CodeSuccess           = 200   // 成功
    CodeInvalidParams     = 400   // 参数错误
    CodeUnauthorized      = 401   // 未授权
    CodeForbidden         = 403   // 禁止访问
    CodeNotFound          = 404   // 资源不存在
    CodeInternalError     = 500   // 内部错误

    // 用户相关错误码
    CodeUserExists        = 1001  // 用户已存在
    CodeUserNotFound      = 1002  // 用户不存在
    CodeInvalidPassword   = 1003  // 密码错误
    CodeWeakPassword      = 1004  // 密码强度不够
    CodeInvalidPhone      = 1005  // 手机号格式错误

    // 六要素相关错误码
    CodeElementNotFound   = 2001  // 六要素不存在
    CodeElementExists     = 2002  // 六要素已存在
    CodeInvalidElement    = 2003  // 六要素参数错误

    // JWT相关错误码
    CodeInvalidToken      = 3001  // Token无效
    CodeTokenExpired      = 3002  // Token过期
    CodeTokenMissing      = 3003  // Token缺失
)
```

## 开发优先级

### 高优先级 (P0)

1. 项目基础架构搭建
2. 数据库设计与初始化
3. 统一响应格式和错误处理
4. 用户注册和登录功能
5. JWT认证中间件

### 中优先级 (P1)

1. 六要素CRUD功能
2. 参数验证和安全处理
3. 日志处理
4. 基础测试

### 低优先级 (P2)

1. API文档生成
2. 性能优化
3. 容器化部署
4. 完整测试覆盖

## 开发时间估算

- **项目搭建**: 1-2天
- **用户模块**: 2-3天
- **六要素模块**: 3-4天
- **测试和优化**: 2-3天
- **文档和部署**: 1-2天

**总计**: 9-14天

## 注意事项

1. **安全性**: 密码必须加密存储，使用bcrypt
2. **参数验证**: 所有输入参数必须严格验证
3. **错误处理**: 统一错误处理，不暴露敏感信息
4. **性能**: 合理使用数据库索引，优化查询性能
5. **日志**: 记录关键操作日志，便于问题排查
6. **测试**: 确保核心功能有充分的测试覆盖
7. **文档**: 保持API文档与代码同步更新

## 后续扩展

1. **缓存**: 引入Redis缓存热点数据
2. **消息队列**: 处理异步任务
3. **文件上传**: 支持模板文件上传
4. **导出功能**: 支持多种格式导出
5. **团队协作**: 支持团队共享模板
6. **版本管理**: 支持模板版本控制
7. **AI集成**: 集成AI能力辅助生成提示词
