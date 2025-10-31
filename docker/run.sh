#!/bin/bash

# CESE Docker 运行脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[CESE]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "CESE Docker 运行脚本"
    echo ""
    echo "用法: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "命令:"
    echo "  dev         启动开发环境"
    echo "  staging     启动预发布环境"
    echo "  prod        启动生产环境"
    echo "  stop        停止所有服务"
    echo "  clean       清理所有容器和数据卷"
    echo "  logs        查看日志"
    echo "  help        显示此帮助信息"
    echo ""
    echo "选项:"
    echo "  --build     强制重新构建镜像"
    echo "  --no-cache  构建时不使用缓存"
    echo ""
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
}

# 启动开发环境
start_dev() {
    print_message "启动开发环境..."

    local build_flag=""
    if [[ "$*" == *"--build"* ]]; then
        build_flag="--build"
    fi

    if [[ "$*" == *"--no-cache"* ]]; then
        build_flag="$build_flag --no-cache"
    fi

    docker-compose -f docker-compose.dev.yml up -d $build_flag

    print_message "开发环境启动完成！"
    print_message "前端地址: http://localhost:3100"
    print_message "后端地址: http://localhost:8081"
    print_message "MySQL: localhost:3307"
    print_message "Redis: localhost:6380"
}

# 启动预发布环境
start_staging() {
    print_message "启动预发布环境..."

    local build_flag=""
    if [[ "$*" == *"--build"* ]]; then
        build_flag="--build"
    fi

    if [[ "$*" == *"--no-cache"* ]]; then
        build_flag="$build_flag --no-cache"
    fi

    docker-compose -f docker-compose.staging.yml up -d $build_flag

    print_message "预发布环境启动完成！"
    print_message "应用地址: http://localhost:3101"
    print_message "后端地址: http://localhost:8082"
    print_message "MySQL: localhost:3308"
    print_message "Redis: localhost:6381"
}

# 启动生产环境
start_prod() {
    print_message "启动生产环境..."

    local build_flag=""
    if [[ "$*" == *"--build"* ]]; then
        build_flag="--build"
    fi

    if [[ "$*" == *"--no-cache"* ]]; then
        build_flag="$build_flag --no-cache"
    fi

    docker-compose up -d $build_flag

    print_message "生产环境启动完成！"
    print_message "应用地址: http://localhost:3100"
    print_message "后端地址: http://localhost:8080"
    print_message "MySQL: localhost:3306"
    print_message "Redis: localhost:6379"
}

# 停止所有服务
stop_services() {
    print_message "停止所有服务..."

    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    docker-compose -f docker-compose.staging.yml down 2>/dev/null || true

    print_message "所有服务已停止"
}

# 清理容器和数据卷
clean_all() {
    print_warning "这将删除所有容器、镜像和数据卷，数据将丢失！"
    read -p "确认继续？(y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "清理所有容器和数据卷..."

        stop_services

        # 删除容器
        docker-compose rm -f 2>/dev/null || true
        docker-compose -f docker-compose.dev.yml rm -f 2>/dev/null || true
        docker-compose -f docker-compose.staging.yml rm -f 2>/dev/null || true

        # 删除数据卷
        docker volume prune -f

        # 删除镜像
        docker image prune -f

        print_message "清理完成"
    else
        print_message "取消清理操作"
    fi
}

# 查看日志
show_logs() {
    print_message "查看服务日志..."

    if docker-compose ps -q > /dev/null 2>&1; then
        docker-compose logs -f
    elif docker-compose -f docker-compose.dev.yml ps -q > /dev/null 2>&1; then
        docker-compose -f docker-compose.dev.yml logs -f
    elif docker-compose -f docker-compose.staging.yml ps -q > /dev/null 2>&1; then
        docker-compose -f docker-compose.staging.yml logs -f
    else
        print_warning "没有运行中的服务"
    fi
}

# 主函数
main() {
    check_docker

    case "${1:-help}" in
        "dev")
            start_dev "${@:2}"
            ;;
        "staging")
            start_staging "${@:2}"
            ;;
        "prod")
            start_prod "${@:2}"
            ;;
        "stop")
            stop_services
            ;;
        "clean")
            clean_all
            ;;
        "logs")
            show_logs
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# 运行主函数
main "$@"
