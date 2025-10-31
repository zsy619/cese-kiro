# CESE Docker 部署文档

## 概述

本目录包含了 CESE（上下文工程六要素）项目的完整 Docker 部署配置，支持开发、预发布和生产三种环境。

## 文件结构

```
docker/
├── Dockerfile                    # 生产环境多阶段构建文件
├── Dockerfile.frontend.dev       # 前端开发环境
├── Dockerfile.backend.dev        # 后端开发环境
├── docker-compose.yml            # 生产环境配置
├── docker-compose.dev.yml        # 开发环境配置
├── docker-compose.staging.yml    # 预发布环境配置
├── nginx.conf                    # Nginx 配置文件
├── nginx.staging.conf            # 预发布环境 Nginx 配置
├── start.sh                      # 容器内启动脚本
├── run.sh                        # 便捷运行脚本
├── init.sql                      # 数据库初始化脚本
├── .dockerignore                 # Docker 忽略文件
└── README.md                     # 本文档
```

## 快速开始

### 1. 使用便捷脚本（推荐）

```bash
# 进入 docker 目录
cd docker

# 启动开发环境
./run.sh dev

# 启动预发布环境
./run.sh staging

# 启动生产环境
./run.sh prod

# 停止所有服务
./run.sh stop

# 查看日志
./run.sh logs

# 清理所有容器和数据
./run.sh clean
```

### 2. 直接使用 Docker Compose

```bash
# 开发环境
docker-compose -f docker/docker-compose.dev.yml up -d

# 预发布环境
docker-compose -f docker/docker-compose.staging.yml up -d

# 生产环境
docker-compose -f docker/docker-compose.yml up -d
```

## 环境配置

### 开发环境

- **前端**: <http://localhost:3100>
- **后端**: <http://localhost:8081>
- **MySQL**: localhost:3307
- **Redis**: localhost:6380
- **特性**: 热重载、开发工具、详细日志

### 预发布环境

- **应用**: <http://localhost:3101>
- **后端**: <http://localhost:8082>
- **MySQL**: localhost:3308
- **Redis**: localhost:6381
- **特性**: 生产构建、SSL支持、性能监控

### 生产环境

- **应用**: <http://localhost:3100>
- **后端**: <http://localhost:8080>
- **MySQL**: localhost:3306
- **Redis**: localhost:6379
- **特性**: 优化构建、安全配置、健康检查

## 环境变量

### 数据库配置

```bash
MYSQL_ROOT_PASSWORD=123456
MYSQL_DATABASE=cese
MYSQL_USER=cese_user
MYSQL_PASSWORD=cese_password
```

### 后端配置

```bash
CESE_DATABASE_HOST=mysql
CESE_DATABASE_PORT=3306
CESE_JWT_SECRET=your-jwt-secret
CESE_LOG_LEVEL=info
CESE_LOG_OUTPUT=file
```

### 前端配置

```bash
NODE_ENV=production
REACT_APP_API_BASE_URL=/api
```

## 数据持久化

所有环境都配置了数据卷持久化：

- **MySQL 数据**: `mysql_data`、`mysql_dev_data`、`mysql_staging_data`
- **Redis 数据**: `redis_data`、`redis_dev_data`、`redis_staging_data`
- **应用日志**: `app_logs`、`app_staging_logs`

## 健康检查

所有服务都配置了健康检查：

- **MySQL**: `mysqladmin ping`
- **Redis**: `redis-cli ping`
- **应用**: `curl http://localhost/health`

## SSL 配置（预发布/生产）

预发布和生产环境支持 SSL，需要将证书文件放置在：

```
docker/ssl/
├── staging.crt
├── staging.key
├── production.crt
└── production.key
```

## 故障排除

### 常见问题

1. **端口冲突**

   ```bash
   # 检查端口占用
   lsof -i :3100

   # 修改 docker-compose.yml 中的端口映射
   ```

2. **数据库连接失败**

   ```bash
   # 检查数据库容器状态
   docker-compose logs mysql

   # 重启数据库服务
   docker-compose restart mysql
   ```

3. **前端构建失败**

   ```bash
   # 清理 node_modules 缓存
   docker-compose build --no-cache frontend
   ```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs mysql
docker-compose logs app

# 实时跟踪日志
docker-compose logs -f
```

### 数据备份

```bash
# 备份 MySQL 数据
docker exec cese-mysql mysqldump -u root -p123456 cese > backup.sql

# 恢复 MySQL 数据
docker exec -i cese-mysql mysql -u root -p123456 cese < backup.sql
```

## 性能优化

### 生产环境优化

1. **Nginx 配置**
   - Gzip 压缩
   - 静态资源缓存
   - 连接池优化

2. **数据库优化**
   - 连接池配置
   - 查询缓存
   - 索引优化

3. **应用优化**
   - 多阶段构建减小镜像大小
   - 健康检查确保服务可用性
   - 资源限制防止过度消耗

## 安全配置

1. **网络隔离**: 使用自定义网络隔离服务
2. **密码管理**: 使用环境变量管理敏感信息
3. **安全头**: 配置 Nginx 安全响应头
4. **SSL/TLS**: 支持 HTTPS 加密传输

## 监控和日志

- **应用日志**: 存储在 `/root/logs` 目录
- **Nginx 日志**: 标准输出，可通过 `docker logs` 查看
- **数据库日志**: MySQL 和 Redis 标准日志
- **健康检查**: 自动监控服务状态

## 扩展和定制

### 添加新服务

1. 在相应的 `docker-compose.yml` 中添加服务定义
2. 配置网络和依赖关系
3. 添加健康检查和环境变量

### 修改配置

1. **Nginx 配置**: 编辑 `nginx.conf`
2. **数据库配置**: 修改环境变量
3. **应用配置**: 更新 `configs/` 目录下的配置文件

## 部署流程

### 开发到预发布

```bash
# 停止开发环境
./run.sh stop

# 启动预发布环境
./run.sh staging --build
```

### 预发布到生产

```bash
# 停止预发布环境
docker-compose -f docker-compose.staging.yml down

# 启动生产环境
./run.sh prod --build
```

## 技术栈

- **容器化**: Docker + Docker Compose
- **Web 服务器**: Nginx
- **数据库**: MySQL 8.0
- **缓存**: Redis 7
- **前端**: React 18 + TypeScript
- **后端**: Go 1.20 + Hertz
- **构建**: 多阶段构建优化
