#!/bin/bash

# 上下文工程六要素小工具 - 前端快速启动脚本
# Context Engineering Six Elements Tool - Frontend Quick Start

set -e

echo "🚀 上下文工程六要素小工具 - 前端启动"
echo "🚀 Context Engineering Six Elements Tool - Frontend Startup"
echo ""

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 进入项目根目录
cd "$PROJECT_ROOT"

# 检查前端目录是否存在
if [ ! -d "frontend" ]; then
    echo "❌ 错误: 未找到 frontend 目录"
    echo "❌ Error: frontend directory not found"
    exit 1
fi

# 进入前端目录
cd frontend

# 检查 Node.js 环境
echo "📋 检查开发环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 设置环境变量
export PORT=3100
export REACT_APP_API_BASE_URL=http://localhost:8080/api
export REACT_APP_APP_TITLE="上下文工程六要素小工具"

# 启动开发服务器
echo ""
echo "🎯 启动前端开发服务器..."
echo "📱 访问地址: http://localhost:3100"
echo "🛠️  开发工具: React DevTools"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
