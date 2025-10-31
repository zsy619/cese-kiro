#!/bin/bash

# CESE 后端构建脚本
# 用途: 编译Go后端服务，支持多平台构建

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目配置
APP_NAME="cese-backend"
VERSION="1.0.0"
BUILD_DIR="build"
BACKEND_DIR="backend"

# 进入后端目录
cd "$BACKEND_DIR"

print_message() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查Go环境
check_go() {
    if ! command -v go &> /dev/null; then
        print_error "Go 未安装，请先安装 Go 1.20+"
        exit 1
    fi

    GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
    print_message "Go 版本: $GO_VERSION"
}

# 安装依赖
install_deps() {
    print_message "安装依赖..."
    go mod download
    go mod tidy
    print_message "依赖安装完成"
}

# 代码检查
code_check() {
    print_message "代码质量检查..."
    go fmt ./...
    go vet ./...
    print_message "代码检查完成"
}

# 构建函数
build_app() {
    local os=$1
    local arch=$2
    local output_name=$3

    print_message "构建 $os/$arch 版本..."

    mkdir -p "$BUILD_DIR"

    CGO_ENABLED=0 GOOS=$os GOARCH=$arch go build \
        -a -installsuffix cgo \
        -ldflags "-X main.version=$VERSION -X main.buildTime=$(date -u +%Y%m%d%H%M%S)" \
        -o "$BUILD_DIR/$output_name" \
        cmd/main.go

    print_message "$os/$arch 构建完成: $BUILD_DIR/$output_name"
}

# 主构建逻辑
main() {
    print_message "开始构建 CESE 后端服务..."

    check_go
    install_deps
    code_check

    # 根据参数决定构建目标
    case "${1:-linux}" in
        "linux")
            build_app "linux" "amd64" "$APP_NAME"
            ;;
        "windows")
            build_app "windows" "amd64" "$APP_NAME.exe"
            ;;
        "darwin")
            build_app "darwin" "amd64" "$APP_NAME-darwin"
            ;;
        "all")
            build_app "linux" "amd64" "$APP_NAME"
            build_app "windows" "amd64" "$APP_NAME.exe"
            build_app "darwin" "amd64" "$APP_NAME-darwin"
            ;;
        *)
            print_error "不支持的构建目标: $1"
            echo "支持的目标: linux, windows, darwin, all"
            exit 1
            ;;
    esac

    print_message "构建完成！"
}

main "$@"
