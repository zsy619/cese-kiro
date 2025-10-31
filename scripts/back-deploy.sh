#!/bin/bash

# CESE 后端部署脚本
# 用途: 部署后端服务到不同环境

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
VERSION="1.0.0"

print_message() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
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

    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装"
        exit 1
    fi
}

# 预部署检查
pre_deploy_check() {
    print_message "执行预部署检查..."

    # 运行测试
    ./scripts/back-test.sh all

    if [ $? -ne 0 ]; then
        print_error "测试失败，停止部署"
        exit 1
    fi

    # 构建应用
    ./scripts/back-build.sh linux

    print_message "预部署检查完成"
}

# 本地部署
deploy_local() {
    print_message "本地部署..."

    cd "$BACKEND_DIR"

    # 停止现有服务
    if [ -f "logs/app.pid" ]; then
        local pid=$(cat logs/app.pid)
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            print_message "停止现有服务，PID: $pid"
        fi
        rm -f logs/app.pid
    fi

    # 备份配置
    if [ -f "configs/config.yaml" ]; then
        cp configs/config.yaml configs/config.yaml.backup
        print_message "配置文件已备份"
    fi

    # 启动新服务
    mkdir -p logs
    nohup ./build/$APP_NAME > logs/app.log 2>&1 &
    local new_pid=$!
    echo $new_pid > logs/app.pid

    print_message "服务已启动，PID: $new_pid"

    # 健康检查
    sleep 5
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        print_message "健康检查通过"
    else
        print_warning "健康检查失败，请检查日志"
    fi
}

# Docker部署
deploy_docker() {
    local env=${1:-prod}
    print_message "Docker部署 ($env 环境)..."

    cd docker

    case "$env" in
        "dev")
            docker-compose -f docker-compose.dev.yml down
            docker-compose -f docker-compose.dev.yml up -d --build
            print_message "开发环境部署完成"
            print_message "访问地址: http://localhost:3100"
            ;;
        "staging")
            docker-compose -f docker-compose.staging.yml down
            docker-compose -f docker-compose.staging.yml up -d --build
            print_message "预发布环境部署完成"
            print_message "访问地址: http://localhost:3101"
            ;;
        "prod")
            docker-compose down
            docker-compose up -d --build
            print_message "生产环境部署完成"
            print_message "访问地址: http://localhost:3100"
            ;;
        *)
            print_error "不支持的环境: $env"
            exit 1
            ;;
    esac

    # 等待服务启动
    sleep 10

    # 健康检查
    local port
    case "$env" in
        "dev") port=3100 ;;
        "staging") port=3101 ;;
        "prod") port=3100 ;;
    esac

    if curl -f http://localhost:$port/health > /dev/null 2>&1; then
        print_message "Docker服务健康检查通过"
    else
        print_warning "Docker服务健康检查失败"
        docker-compose logs --tail=50
    fi
}

# 远程部署
deploy_remote() {
    local server=$1
    local user=${2:-root}

    if [ -z "$server" ]; then
        print_error "请指定服务器地址"
        exit 1
    fi

    print_message "远程部署到 $user@$server..."

    # 构建应用
    ./scripts/back-build.sh linux

    # 创建部署包
    local deploy_package="cese-backend-$VERSION.tar.gz"
    cd "$BACKEND_DIR"
    tar -czf "../$deploy_package" build/ configs/ docker/
    cd ..

    # 上传到服务器
    scp "$deploy_package" "$user@$server:/tmp/"

    # 远程执行部署
    ssh "$user@$server" << EOF
        cd /opt/cese-backend

        # 备份当前版本
        if [ -d "current" ]; then
            mv current backup-\$(date +%Y%m%d%H%M%S)
        fi

        # 解压新版本
        mkdir -p current
        cd current
        tar -xzf /tmp/$deploy_package

        # 停止旧服务
        if [ -f "../logs/app.pid" ]; then
            kill \$(cat ../logs/app.pid) || true
            rm -f ../logs/app.pid
        fi

        # 启动新服务
        mkdir -p ../logs
        nohup ./build/$APP_NAME > ../logs/app.log 2>&1 &
        echo \$! > ../logs/app.pid

        # 清理临时文件
        rm -f /tmp/$deploy_package

        echo "远程部署完成"
EOF

    # 清理本地临时文件
    rm -f "$deploy_package"

    print_message "远程部署完成"
}

# 回滚部署
rollback_deployment() {
    print_message "回滚部署..."

    cd "$BACKEND_DIR"

    # 停止当前服务
    if [ -f "logs/app.pid" ]; then
        local pid=$(cat logs/app.pid)
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
        fi
        rm -f logs/app.pid
    fi

    # 恢复配置
    if [ -f "configs/config.yaml.backup" ]; then
        mv configs/config.yaml.backup configs/config.yaml
        print_message "配置文件已恢复"
    fi

    # 这里可以添加更多回滚逻辑
    print_message "回滚完成"
}

# 显示帮助
show_help() {
    echo "CESE 后端部署脚本"
    echo ""
    echo "用法: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "命令:"
    echo "  local                本地部署"
    echo "  docker [env]         Docker部署 (dev/staging/prod)"
    echo "  remote <server> [user] 远程部署"
    echo "  rollback             回滚部署"
    echo "  help                 显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 local"
    echo "  $0 docker prod"
    echo "  $0 remote 192.168.1.100 ubuntu"
    echo ""
}

# 主函数
main() {
    check_env

    case "${1:-help}" in
        "local")
            pre_deploy_check
            deploy_local
            ;;
        "docker")
            pre_deploy_check
            deploy_docker "${2:-prod}"
            ;;
        "remote")
            pre_deploy_check
            deploy_remote "$2" "$3"
            ;;
        "rollback")
            rollback_deployment
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"
