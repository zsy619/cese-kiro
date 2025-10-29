#!/bin/bash

# 上下文工程六要素小工具 - 前端开发服务器启动脚本
# Context Engineering Six Elements Tool - Frontend Development Server

echo "🚀 启动上下文工程六要素小工具前端开发服务器..."
echo "🚀 Starting Context Engineering Six Elements Tool Frontend..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 环境..."
node_version=$(node -v)
echo "Node.js 版本: $node_version"

# 检查 npm 版本
npm_version=$(npm -v)
echo "npm 版本: $npm_version"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 未发现 node_modules，正在安装依赖..."
    npm install
else
    echo "✅ 依赖已安装"
fi

# 检查 react-scripts 是否存在
if [ ! -f "node_modules/.bin/react-scripts" ]; then
    echo "❌ react-scripts 未找到，正在重新安装..."
    npm install react-scripts@5.0.1
else
    echo "✅ react-scripts 已安装"
fi

# 设置环境变量
export PORT=3100
export REACT_APP_API_BASE_URL=http://localhost:8080
export REACT_APP_APP_TITLE="上下文工程六要素小工具"
export REACT_APP_OLLAMA_ENABLED=true

echo ""
echo "🌐 服务器配置:"
echo "   端口: $PORT"
echo "   API 地址: $REACT_APP_API_BASE_URL"
echo "   应用标题: $REACT_APP_APP_TITLE"
echo ""

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "📱 前端地址: http://localhost:$PORT"
echo "🔧 开发工具: React DevTools"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动 React 开发服务器
npm start