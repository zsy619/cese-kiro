# CESE 后端服务

基于 Golang + Hertz + MySQL + GORM 构建的上下文工程六要素工具后端服务。

## 功能特性

- 🔐 用户注册、登录、密码管理
- 📝 上下文工程六要素 CRUD 操作
- 🔍 六要素记录搜索和过滤
- 🛡️ JWT 认证和权限控制
- 📊 分页查询支持
- 📝 完整的日志记录
- 🐳 Docker 容器化部署

## 技术栈

- **语言**: Golang 1.20+
- **Web框架**: Hertz (字节跳动)
- **数据库**: MySQL 8.0+
- **ORM**: GORM
- **认证**: JWT
- **日志**: Logrus
- **配置**: Viper
- **容器**: Docker

## 项目结构

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
│   └── utils/                  # 工具函数
├── pkg/
│   ├── response/               # 统一响应格式
│   ├── validator/              # 参数验证
│   └── logger/                 # 日志工具
├── configs/
│   ├── config.yaml            # 配置文件
│   └── config.example.yaml    # 配置示例
├── docker/
│   └── init.sql               # 数据库初始化脚本
├── Dockerfile
├── go.mod
├── go.sum
└── README.md
```

## 快速开始

### 环境要求

- Go 1.20+
- MySQL 8.0+
- Docker (可选)

### 本地开发

1. **克隆项目**

```bash
git clone <repository-url>
cd backend
```

2. **安装依赖**

```bash
go mod download
```

3. **配置数据库**

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE cese CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入初始化脚本
mysql -u root -p cese < docker/init.sql
```

4. **配置文件**

```bash
cp configs/config.example.yaml configs/config.yaml
# 编辑 configs/config.yaml 修改数据库连接信息
```

5. **运行服务**

```bash
go run cmd/main.go
```

服务将在 `http://localhost:8080` 启动。

### Docker 部署

1. **构建镜像**

```bash
docker build -t cese-backend .
```

2. **运行容器**

```bash
docker run -d \
  --name cese-backend \
  -p 8080:8080 \
  -v $(pwd)/configs:/root/configs \
  -v $(pwd)/logs:/root/logs \
  cese-backend
```

### Docker Compose 部署

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: cese
    ports:
      - "3306:3306"
    volumes:
      - ./docker/init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - mysql
    volumes:
      - ./configs:/root/configs
      - ./logs:/root/logs

volumes:
  mysql_data:
```

## API 文档

### 用户相关接口

#### 用户注册

```http
POST /api/v1/user/register
Content-Type: application/json

{
    "phone": "13800138000",
    "password": "Password123!"
}
```

#### 用户登录

```http
POST /api/v1/user/login
Content-Type: application/json

{
    "phone": "13800138000",
    "password": "Password123!"
}
```

#### 修改密码

```http
PUT /api/v1/user/password
Authorization: Bearer <token>
Content-Type: application/json

{
    "old_password": "Password123!",
    "new_password": "NewPassword456@"
}
```

#### 获取用户信息

```http
GET /api/v1/user/profile
Authorization: Bearer <token>
```

### 六要素相关接口

#### 创建六要素

```http
POST /api/v1/context-elements
Authorization: Bearer <token>
Content-Type: application/json

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

#### 查询六要素列表

```http
GET /api/v1/context-elements?page=1&size=15&keyword=AI
Authorization: Bearer <token>
```

#### 获取单个六要素

```http
GET /api/v1/context-elements/1
Authorization: Bearer <token>
```

#### 更新六要素

```http
PUT /api/v1/context-elements/1
Authorization: Bearer <token>
Content-Type: application/json

{
    "subject": "AI助手开发v2",
    "task_goal": "开发一个更智能的客服助手"
}
```

#### 删除六要素

```http
DELETE /api/v1/context-elements/1
Authorization: Bearer <token>
```

## 配置说明

### 数据库配置

```yaml
database:
  host: "localhost"
  port: 3306
  username: "root"
  password: "123456"
  database: "cese"
  charset: "utf8mb4"
  parse_time: true
  loc: "Local"
```

### JWT配置

```yaml
jwt:
  secret: "your-jwt-secret-key"
  expire_hours: 24
```

### 日志配置

```yaml
log:
  level: "info"
  format: "json"
  output: "stdout"
  file_path: "logs/app.log"
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 内部错误 |
| 1001 | 用户已存在 |
| 1002 | 用户不存在 |
| 1003 | 密码错误 |
| 1004 | 密码强度不够 |
| 1005 | 手机号格式错误 |
| 2001 | 六要素不存在 |
| 3001 | Token无效 |
| 3002 | Token过期 |

## 开发指南

### 添加新的API接口

1. 在 `internal/model/` 中定义请求和响应结构体
2. 在 `internal/repository/` 中添加数据访问方法
3. 在 `internal/service/` 中实现业务逻辑
4. 在 `internal/handler/` 中添加HTTP处理器
5. 在 `internal/handler/router.go` 中注册路由

### 数据库迁移

项目使用 GORM 的 AutoMigrate 功能自动迁移数据库结构。如需手动迁移：

```bash
# 连接数据库执行SQL
mysql -u root -p cese < docker/init.sql
```

### 日志记录

使用 logrus 记录日志：

```go
import "cese-backend/pkg/logger"

logger.GetLogger().Info("信息日志")
logger.GetLogger().Error("错误日志")
```

## 测试

### 运行测试

```bash
go test ./...
```

### API测试

可以使用 Postman、curl 或其他HTTP客户端测试API接口。

## 部署

### 生产环境部署

1. 修改配置文件中的数据库连接信息
2. 设置强密码的JWT密钥
3. 配置日志输出到文件
4. 使用反向代理（如Nginx）
5. 配置HTTPS证书

### 性能优化

- 配置数据库连接池
- 启用数据库查询缓存
- 使用Redis缓存热点数据
- 配置负载均衡

## 贡献

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
