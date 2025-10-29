#!/bin/bash

# 上下文工程六要素小工具 - 前端快速启动脚本
# Context Engineering Six Elements Tool - Frontend Quick Start

echo "🚀 上下文工程六要素小工具 - 前端启动"
echo "🚀 Context Engineering Six Elements Tool - Frontend Startup"
echo ""

# 检查是否在项目根目录
if [ ! -d "frontend" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    echo "❌ Error: Please run this script from the project root directory"
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

# 启动开发服务器
echo ""
echo "🎯 启动前端开发服务器..."
echo "📱 访问地址: http://localhost:3100"
echo "🛠️  开发工具: React DevTools"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 使用自定义启动脚本
if [ -f "start-dev.sh" ]; then
    ./start-dev.sh
else
    npm run dev
fi