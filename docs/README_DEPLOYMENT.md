# 部署文档

## 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro

# 安装前端依赖
cd frontend
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3100
```

### Docker 部署

#### 方式一：使用 docker-compose（推荐）

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 方式二：手动 Docker 命令

```bash
# 构建镜像
docker build -t cese-kiro:latest .

# 运行容器
docker run -d -p 3100:80 --name cese-kiro cese-kiro:latest

# 查看日志
docker logs -f cese-kiro

# 停止容器
docker stop cese-kiro
docker rm cese-kiro
```

### 使用部署脚本

```bash
# 赋予执行权限
chmod +x scripts/*.sh

# 运行部署脚本
./scripts/deploy.sh production
```

## 环境配置

### 环境变量

创建 `.env` 文件（参考 `.env.example`）：

```env
# 应用配置
REACT_APP_NAME=上下文工程六要素小工具
REACT_APP_VERSION=1.0.0

# API 配置
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=30000

# 开发服务器配置
PORT=3100
BROWSER=none
```

### 不同环境配置

- **开发环境**: `.env.development`
- **生产环境**: `.env.production`
- **测试环境**: `.env.test`

## 部署到不同平台

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd frontend
vercel
```

### 部署到 Netlify

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
cd frontend
npm run build
netlify deploy --prod --dir=build
```

### 部署到云服务器

#### 1. 准备服务器

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. 上传代码

```bash
# 使用 Git
git clone https://github.com/zsy619/cese-kiro.git
cd cese-kiro

# 或使用 SCP
scp -r ./cese-kiro user@server:/path/to/deploy
```

#### 3. 部署应用

```bash
# 使用部署脚本
./scripts/deploy.sh production

# 或手动部署
docker-compose up -d
```

### 部署到 Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cese-kiro
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cese-kiro
  template:
    metadata:
      labels:
        app: cese-kiro
    spec:
      containers:
      - name: cese-kiro
        image: your-registry/cese-kiro:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: cese-kiro
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: cese-kiro
```

```bash
# 部署到 K8s
kubectl apply -f deployment.yaml
```

## CI/CD 配置

### GitHub Actions

项目已配置 GitHub Actions，自动执行：

1. 代码检查
2. 类型检查
3. 测试运行
4. 构建项目
5. Docker 镜像构建和推送

#### 配置 Secrets

在 GitHub 仓库设置中添加：

- `DOCKER_USERNAME`: Docker Hub 用户名
- `DOCKER_PASSWORD`: Docker Hub 密码或访问令牌

### GitLab CI

创建 `.gitlab-ci.yml`：

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - cd frontend
    - npm ci
    - npm run lint
    - npm run type-check
    - npm test -- --watchAll=false

build:
  stage: build
  image: node:18
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/build

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t cese-kiro:latest .
    - docker push cese-kiro:latest
  only:
    - main
```

## 监控和维护

### 健康检查

```bash
# 检查应用状态
curl http://localhost:3100

# 检查 Docker 容器
docker ps
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 性能监控

使用以下工具监控应用性能：

- **Lighthouse**: 性能审计
- **Web Vitals**: 核心性能指标
- **Sentry**: 错误追踪（可选）

### 备份策略

```bash
# 备份用户数据（如果使用本地存储）
docker exec cese-kiro tar czf /backup/data-$(date +%Y%m%d).tar.gz /data

# 备份 Docker 镜像
docker save cese-kiro:latest | gzip > cese-kiro-backup.tar.gz
```

### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./scripts/deploy.sh production

# 或使用 Docker Compose
docker-compose pull
docker-compose up -d
```

### 回滚

```bash
# 回滚到上一个版本
git checkout <previous-commit>
./scripts/deploy.sh production

# 或使用 Docker 标签
docker-compose down
docker tag cese-kiro:previous cese-kiro:latest
docker-compose up -d
```

## 故障排查

### 常见问题

#### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3100

# 杀死进程
kill -9 <PID>
```

#### 2. Docker 容器无法启动

```bash
# 查看详细日志
docker-compose logs

# 重新构建镜像
docker-compose build --no-cache
docker-compose up -d
```

#### 3. 应用无法访问

```bash
# 检查防火墙
sudo ufw status
sudo ufw allow 3100

# 检查 Nginx 配置
docker exec cese-kiro nginx -t
```

#### 4. 内存不足

```bash
# 清理 Docker 资源
docker system prune -a

# 限制容器内存
docker-compose.yml 中添加：
services:
  frontend:
    mem_limit: 512m
```

## 安全建议

### 1. 使用 HTTPS

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ... 其他配置
}
```

### 2. 设置安全头

已在 `nginx.conf` 中配置：

- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### 3. 限制访问

```nginx
# 限制请求速率
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

server {
    location / {
        limit_req zone=one burst=20;
    }
}
```

### 4. 定期更新

```bash
# 更新依赖
cd frontend
npm audit
npm audit fix

# 更新 Docker 镜像
docker pull node:18-alpine
docker pull nginx:alpine
```

## 性能优化

### 1. 启用 Gzip 压缩

已在 `nginx.conf` 中配置

### 2. 配置缓存

已在 `nginx.conf` 中配置静态资源缓存

### 3. 使用 CDN

```html
<!-- 在 index.html 中添加 -->
<link rel="dns-prefetch" href="https://cdn.example.com">
<link rel="preconnect" href="https://cdn.example.com">
```

### 4. 优化构建

```bash
# 分析构建产物
cd frontend
npm run analyze

# 查看包大小
npm run build
```

## 支持

如有问题，请：

1. 查看 [文档](./docs/)
2. 提交 [Issue](https://github.com/zsy619/cese-kiro/issues)
3. 查看 [FAQ](./docs/FAQ.md)

---

**最后更新**: 2024年
**维护者**: 开发团队
