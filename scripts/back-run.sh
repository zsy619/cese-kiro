#!/bin/bash

# CESE 后端运行脚本
# 用途: 启动Go后端服务，支持开发和生产模式

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目配置
BACKEND_DIR="backend"
APP_NAME="cese-backend"
BUILD_DIR="build"

print_message() {
    echo -e "${GREEN}[RUN]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境
check_env() {
    if ! command -v go &> /dev/null; then
        print_error "Go 未安装"
        exit 1
    fi

    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "后端目录不存在: $BACKEND_DIR"
        exit 1
    fi
}

# 开发模式运行
run_dev() {
    print_message "启动开发模式..."
    cd "$BACKEND_DIR"

    # 检查是否安装了air（热重载工具）
    if command -v air &> /dev/null; then
        print_message "使用 air 热重载启动..."
        air -c .air.toml
    else
        print_warning "air 未安装，使用普通模式启动"
        print_message "提示: 安装 air 可获得热重载功能: go install github.com/cosmtrek/air@latest"
        go run cmd/main.go
    fi
}

# 生产模式运行
run_prod() {
    print_message "启动生产模式..."

    # 检查是否已构建
    if [ ! -f "$BACKEND_DIR/$BUILD_DIR/$APP_NAME" ]; then
        print_warning "未找到构建文件，开始构建..."
        ./scripts/back-build.sh linux
    fi

    cd "$BACKEND_DIR"
    print_message "启动服务: $BUILD_DIR/$APP_NAME"
    ./$BUILD_DIR/$APP_NAME
}

# 后台运行
run_daemon() {
    print_message "后台启动服务..."

    if [ ! -f "$BACKEND_DIR/$BUILD_DIR/$APP_NAME" ]; then
        print_warning "未找到构建文件，开始构建..."
        ./scripts/back-build.sh linux
    fi

    cd "$BACKEND_DIR"

    # 创建日志目录
    mkdir -p logs

    # 启动后台服务
    nohup ./$BUILD_DIR/$APP_NAME > logs/app.log 2>&1 &

    local pid=$!
    echo $pid > logs/app.pid

    print_message "服务已启动，PID: $pid"
    print_message "日志文件: $BACKEND_DIR/logs/app.log"
    print_message "PID文件: $BACKEND_DIR/logs/app.pid"
}

# 停止后台服务
stop_daemon() {
    print_message "停止后台服务..."

    local pid_file="$BACKEND_DIR/logs/app.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            rm -f "$pid_file"
            print_message "服务已停止，PID: $pid"
        else
            print_warning "进程不存在，PID: $pid"
            rm -f "$pid_file"
        fi
    else
        print_warning "PID文件不存在: $pid_file"
    fi
}

# 显示帮助
show_help() {
    echo "CESE 后端运行脚本"
    echo ""
    echo "用法: $0 [COMMAND]"
    echo ""
    echo "命令:"
    echo "  dev      开发模式运行（支持热重载）"
    echo "  prod     生产模式运行"
    echo "  daemon   后台运行"
    echo "  stop     停止后台服务"
    echo "  help     显示帮助信息"
    echo ""
}

# 主函数
main() {
    check_env

    case "${1:-dev}" in
        "dev")
            run_dev
            ;;
        "prod")
            run_prod
            ;;
        "daemon")
            run_daemon
            ;;
        "stop")
            stop_daemon
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"
