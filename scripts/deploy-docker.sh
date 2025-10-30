#!/bin/bash

# Docker 部署脚本
# 用法: ./scripts/deploy-docker.sh [环境]
# 环境: development, staging, production

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="cese-kiro"

echo "🚀 开始部署到 $ENVIRONMENT 环境..."

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 1. 检查环境
echo "📋 检查部署环境..."
if [ "$ENVIRONMENT" != "development" ] && [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ 错误: 无效的环境参数。请使用 development, staging 或 production"
    exit 1
fi

# 2. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 3. 安装前端依赖
echo "📦 安装前端依赖..."
cd frontend
npm ci

# 4. 运行测试
echo "🧪 运行测试..."
npm run test -- --watchAll=false

# 5. 代码检查
echo "🔍 代码检查..."
npm run lint
npm run type-check

# 6. 构建前端
echo "🏗️  构建前端..."
npm run build

cd "$PROJECT_ROOT"

# 7. 构建 Docker 镜像
echo "🐳 构建 Docker 镜像..."
docker build -t $PROJECT_NAME:$ENVIRONMENT .

# 8. 停止旧容器
echo "🛑 停止旧容器..."
if [ "$ENVIRONMENT" = "development" ]; then
    docker-compose -f docker-compose.dev.yml down || true
elif [ "$ENVIRONMENT" = "staging" ]; then
    docker-compose -f docker-compose.staging.yml down || true
else
    docker-compose down || true
fi

# 9. 启动新容器
echo "▶️  启动新容器..."
if [ "$ENVIRONMENT" = "development" ]; then
    docker-compose -f docker-compose.dev.yml up -d
elif [ "$ENVIRONMENT" = "staging" ]; then
    docker-compose -f docker-compose.staging.yml up -d
else
    docker-compose up -d
fi

# 10. 健康检查
echo "🏥 健康检查..."
sleep 5
if curl -f http://localhost:3100/health > /dev/null 2>&1; then
    echo "✅ 部署成功！应用运行在 http://localhost:3100"
else
    echo "❌ 部署失败！应用无法访问"
    if [ "$ENVIRONMENT" = "development" ]; then
        docker-compose -f docker-compose.dev.yml logs
    elif [ "$ENVIRONMENT" = "staging" ]; then
        docker-compose -f docker-compose.staging.yml logs
    else
        docker-compose logs
    fi
    exit 1
fi

echo "🎉 部署完成！"
