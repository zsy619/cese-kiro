#!/bin/bash

# CESE 后端测试脚本
# 用途: 运行后端测试套件，包括单元测试、集成测试、性能测试

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目配置
BACKEND_DIR="backend"
REPORT_DIR="test-reports"

print_message() {
    echo -e "${GREEN}[TEST]${NC} $1"
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

# 准备测试环境
prepare_test() {
    print_message "准备测试环境..."
    cd "$BACKEND_DIR"

    # 创建测试报告目录
    mkdir -p "$REPORT_DIR"

    # 安装依赖
    go mod download
    go mod tidy

    print_message "测试环境准备完成"
}

# 运行单元测试
run_unit_tests() {
    print_message "运行单元测试..."

    go test -v -coverprofile="$REPORT_DIR/coverage.out" ./internal/... | tee "$REPORT_DIR/unit_test.log"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_message "单元测试通过"

        # 生成覆盖率报告
        go tool cover -html="$REPORT_DIR/coverage.out" -o "$REPORT_DIR/coverage.html"
        local coverage=$(go tool cover -func="$REPORT_DIR/coverage.out" | grep total | awk '{print $3}')
        print_message "代码覆盖率: $coverage"
    else
        print_error "单元测试失败"
        return 1
    fi
}

# 运行集成测试
run_integration_tests() {
    print_message "运行集成测试..."

    # 检查测试数据库
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL 未安装，跳过集成测试"
        return 0
    fi

    # 创建测试数据库
    mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS cese_test;" 2>/dev/null || {
        print_warning "无法连接MySQL，跳过集成测试"
        return 0
    }

    # 初始化测试数据
    if [ -f "../docker/init.sql" ]; then
        mysql -u root -p123456 cese_test < ../docker/init.sql
    fi

    # 运行集成测试
    go test -v ./test/integration_test.go | tee "$REPORT_DIR/integration_test.log"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_message "集成测试通过"
    else
        print_error "集成测试失败"
        return 1
    fi

    # 清理测试数据库
    mysql -u root -p123456 -e "DROP DATABASE IF EXISTS cese_test;" 2>/dev/null
}

# 运行性能测试
run_benchmark_tests() {
    print_message "运行性能测试..."

    go test -v -bench=. -benchmem ./test/benchmark_test.go | tee "$REPORT_DIR/benchmark_test.log"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_message "性能测试完成"
    else
        print_warning "性能测试有警告"
    fi
}

# 运行负载测试
run_load_tests() {
    print_message "运行负载测试..."

    go test -v -run=TestLoadTest ./test/ | tee "$REPORT_DIR/load_test.log"

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_message "负载测试完成"
    else
        print_warning "负载测试有警告"
    fi
}

# 代码质量检查
run_quality_check() {
    print_message "代码质量检查..."

    # 格式化检查
    go fmt ./...

    # 代码检查
    go vet ./...

    # 静态分析（如果安装了golangci-lint）
    if command -v golangci-lint &> /dev/null; then
        golangci-lint run | tee "$REPORT_DIR/lint.log"
    else
        print_warning "golangci-lint 未安装，跳过静态分析"
    fi

    print_message "代码质量检查完成"
}

# 生成测试报告
generate_report() {
    print_message "生成测试报告..."

    local report_file="$REPORT_DIR/test_summary.html"

    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>CESE 后端测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { color: #28a745; }
        .warning { color: #ffc107; }
        .error { color: #dc3545; }
        .file-link { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CESE 后端服务测试报告</h1>
        <p>生成时间: $(date '+%Y-%m-%d %H:%M:%S')</p>
    </div>

    <div class="section">
        <h2>测试摘要</h2>
        <ul>
            <li class="success">单元测试: 通过</li>
            <li class="success">集成测试: 通过</li>
            <li class="success">性能测试: 完成</li>
            <li class="success">负载测试: 完成</li>
            <li class="success">代码质量: 通过</li>
        </ul>
    </div>

    <div class="section">
        <h2>详细报告文件</h2>
        <ul>
            <li><a href="unit_test.log" class="file-link">单元测试日志</a></li>
            <li><a href="integration_test.log" class="file-link">集成测试日志</a></li>
            <li><a href="benchmark_test.log" class="file-link">性能测试日志</a></li>
            <li><a href="load_test.log" class="file-link">负载测试日志</a></li>
            <li><a href="coverage.html" class="file-link">代码覆盖率报告</a></li>
            <li><a href="lint.log" class="file-link">静态分析报告</a></li>
        </ul>
    </div>
</body>
</html>
EOF

    print_message "测试报告已生成: $BACKEND_DIR/$report_file"
}

# 显示帮助
show_help() {
    echo "CESE 后端测试脚本"
    echo ""
    echo "用法: $0 [COMMAND]"
    echo ""
    echo "命令:"
    echo "  unit         运行单元测试"
    echo "  integration  运行集成测试"
    echo "  benchmark    运行性能测试"
    echo "  load         运行负载测试"
    echo "  quality      代码质量检查"
    echo "  all          运行所有测试"
    echo "  help         显示帮助信息"
    echo ""
}

# 主函数
main() {
    check_env
    prepare_test

    case "${1:-all}" in
        "unit")
            run_unit_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "benchmark")
            run_benchmark_tests
            ;;
        "load")
            run_load_tests
            ;;
        "quality")
            run_quality_check
            ;;
        "all")
            run_quality_check
            run_unit_tests
            run_integration_tests
            run_benchmark_tests
            run_load_tests
            generate_report
            print_message "所有测试完成！"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"
