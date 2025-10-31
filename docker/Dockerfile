# 多阶段构建 Dockerfile - 前后端合并版本

# 阶段 1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY frontend/package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制前端源代码
COPY frontend/ ./

# 构建前端
RUN npm run build

# 阶段 2: 构建后端
FROM golang:1.20-alpine AS backend-builder

# 设置工作目录
WORKDIR /app

# 安装必要的包
RUN apk add --no-cache git

# 复制 go mod 文件
COPY backend/go.mod backend/go.sum ./

# 下载依赖
RUN go mod download

# 复制后端源代码
COPY backend/ ./

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/main.go

# 阶段 3: 生产环境 - Nginx + 后端
FROM alpine:latest

# 安装nginx和必要的包
RUN apk --no-cache add nginx ca-certificates tzdata curl

# 设置时区
ENV TZ=Asia/Shanghai

# 创建nginx用户和组
RUN addgroup -g 101 -S nginx && \
    adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# 创建必要的目录
RUN mkdir -p /var/log/nginx /var/cache/nginx /etc/nginx/conf.d /usr/share/nginx/html /root/logs

# 复制nginx配置
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建好的前端文件
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

# 复制后端二进制文件
COPY --from=backend-builder /app/main /root/main

# 复制后端配置文件
COPY --from=backend-builder /app/configs /root/configs

# 复制启动脚本
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

# 暴露端口
EXPOSE 80 8080

# 启动脚本
CMD ["/start.sh"]
