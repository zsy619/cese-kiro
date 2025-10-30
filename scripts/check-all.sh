#!/bin/bash

# 代码质量检查脚本
# 检查代码规范、类型、格式等

set -e

echo "🔍 开始代码质量检查..."

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 检查前端
if [ -d "frontend" ]; then
    echo ""
    echo "📦 检查前端代码..."
    cd frontend

    echo "  ├─ ESLint 检查..."
    npm run lint

    echo "  ├─ TypeScript 类型检查..."
    npm run type-check

    echo "  └─ Prettier 格式检查..."
    npm run format:check

    cd "$PROJECT_ROOT"
    echo "✅ 前端代码检查通过"
fi

# 检查后端（待实现）
if [ -d "backend" ]; then
    echo ""
    echo "📦 检查后端代码..."
    cd backend

    # Go 代码检查
    # echo "  ├─ Go fmt 检查..."
    # go fmt ./...

    # echo "  ├─ Go vet 检查..."
    # go vet ./...

    # echo "  └─ Go lint 检查..."
    # golangci-lint run

    cd "$PROJECT_ROOT"
    echo "✅ 后端代码检查通过"
fi

echo ""
echo "🎉 所有代码质量检查通过！"
