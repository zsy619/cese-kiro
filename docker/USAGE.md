# Docker 使用指南

## 快速启动

### 开发环境

```bash
cd docker
./run.sh dev
```

访问: <http://localhost:3100>

### 生产环境

```bash
cd docker
./run.sh prod
```

访问: <http://localhost:3100>

### 预发布环境

```bash
cd docker
./run.sh staging
```

访问: <http://localhost:3101>

## 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
./run.sh logs

# 停止服务
./run.sh stop

# 重新构建
./run.sh prod --build

# 清理所有数据
./run.sh clean
```

## 端口说明

| 环境 | 前端 | 后端 | MySQL | Redis |
|------|------|------|-------|-------|
| 开发 | 3100 | 8081 | 3307  | 6380  |
| 预发布 | 3101 | 8082 | 3308  | 6381  |
| 生产 | 3100 | 8080 | 3306  | 6379  |

## 故障排除

1. **端口被占用**: 修改 docker-compose.yml 中的端口映射
2. **构建失败**: 使用 `--no-cache` 选项重新构建
3. **数据库连接失败**: 检查容器是否正常启动

详细文档请参考 [README.md](./README.md)
