#!/bin/sh

# 启动脚本 - 同时运行前端nginx和后端服务

# 启动后端服务（后台运行）
cd /root
./main &

# 等待后端服务启动
sleep 5

# 启动nginx（前台运行）
nginx -g "daemon off;"
