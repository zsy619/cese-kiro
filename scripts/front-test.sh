#!/bin/bash

# 前端测试脚本
# 用法: ./scripts/front-test.sh [选项]
# 选项: --watch (监听模式), --coverage (覆盖率), --update (更新快照)

set -e

WATCH_MODE=false
COVERAGE=false
UPDATE_SNAPSHOTS=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --watch)
            WATCH_MODE=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --update)
            UPDATE_SNAPSHOTS=true
            shift
            ;;
        *)
            echo "未知参数: $1"
            exit 1
            ;;
    esac
done

echo "🧪 开始运行前端测试..."

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT/frontend"

# 构建测试命令
TEST_CMD="npm test --"

if [ "$WATCH_MODE" = false ]; then
    TEST_CMD="$TEST_CMD --watchAll=false"
fi

if [ "$COVERAGE" = true ]; then
    TEST_CMD="$TEST_CMD --coverage"
fi

if [ "$UPDATE_SNAPSHOTS" = true ]; then
    TEST_CMD="$TEST_CMD --updateSnapshot"
fi

# 运行测试
eval $TEST_CMD

cd "$PROJECT_ROOT"

echo "✅ 测试完成！"
