#!/bin/bash

# 前端构建脚本
# 用法: ./scripts/front-build.sh

set -e

echo "🏗️  开始构建前端项目..."

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# 1. 清理旧的构建产物
echo "🧹 清理旧的构建产物..."
rm -rf frontend/build

# 2. 进入前端目录
cd frontend

# 3. 安装依赖
echo "📦 安装依赖..."
npm ci

# 4. 运行代码检查
echo "🔍 运行代码检查..."
npm run lint
npm run type-check
npm run format:check

# 5. 运行测试
echo "🧪 运行测试..."
npm test -- --watchAll=false --coverage

# 6. 构建项目
echo "🏗️  构建项目..."
npm run build

# 7. 分析构建产物
echo "📊 分析构建产物..."
if [ -d "build" ]; then
    echo "✅ 构建成功！"
    echo "📦 构建产物大小:"
    du -sh build
    echo ""
    echo "📁 主要文件:"
    find build -type f -name "*.js" -o -name "*.css" | head -10
else
    echo "❌ 构建失败！"
    exit 1
fi

cd "$PROJECT_ROOT"

echo "🎉 前端构建完成！"
