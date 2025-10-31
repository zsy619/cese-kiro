# CESE 后端服务 Makefile

# 变量定义
APP_NAME=cese-backend
VERSION=1.0.0
BUILD_DIR=build
DOCKER_IMAGE=cese-backend:$(VERSION)

# Go 相关变量
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod

# 默认目标
.PHONY: all
all: clean deps test build

# 安装依赖
.PHONY: deps
deps:
	$(GOMOD) download
	$(GOMOD) tidy

# 运行应用
.PHONY: run
run:
	$(GOCMD) run cmd/main.go

# 构建应用
.PHONY: build
build:
	mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 GOOS=linux $(GOBUILD) -a -installsuffix cgo -o $(BUILD_DIR)/$(APP_NAME) cmd/main.go

# 构建 Windows 版本
.PHONY: build-windows
build-windows:
	mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 GOOS=windows $(GOBUILD) -a -installsuffix cgo -o $(BUILD_DIR)/$(APP_NAME).exe cmd/main.go

# 构建 macOS 版本
.PHONY: build-darwin
build-darwin:
	mkdir -p $(BUILD_DIR)
	CGO_ENABLED=0 GOOS=darwin $(GOBUILD) -a -installsuffix cgo -o $(BUILD_DIR)/$(APP_NAME)-darwin cmd/main.go

# 运行单元测试
.PHONY: test
test:
	$(GOTEST) -v ./internal/...

# 运行集成测试
.PHONY: test-integration
test-integration:
	$(GOTEST) -v ./test/integration_test.go

# 运行压力测试
.PHONY: test-benchmark
test-benchmark:
	$(GOTEST) -v -bench=. ./test/benchmark_test.go

# 运行所有测试
.PHONY: test-all
test-all: test test-integration test-benchmark

# 测试覆盖率
.PHONY: test-coverage
test-coverage:
	$(GOTEST) -v -coverprofile=coverage.out ./internal/...
	$(GOCMD) tool cover -html=coverage.out -o coverage.html
	@echo "测试覆盖率报告已生成: coverage.html"

# 代码格式化
.PHONY: fmt
fmt:
	$(GOCMD) fmt ./...

# 代码检查
.PHONY: vet
vet:
	$(GOCMD) vet ./...

# 静态分析
.PHONY: lint
lint:
	golangci-lint run

# 清理构建文件
.PHONY: clean
clean:
	$(GOCLEAN)
	rm -rf $(BUILD_DIR)
	rm -f coverage.out coverage.html

# Docker 构建
.PHONY: docker-build
docker-build:
	docker build -t $(DOCKER_IMAGE) .

# Docker 运行
.PHONY: docker-run
docker-run:
	docker run -d --name $(APP_NAME) -p 8080:8080 $(DOCKER_IMAGE)

# Docker 停止
.PHONY: docker-stop
docker-stop:
	docker stop $(APP_NAME) || true
	docker rm $(APP_NAME) || true

# Docker 清理
.PHONY: docker-clean
docker-clean: docker-stop
	docker rmi $(DOCKER_IMAGE) || true

# 数据库迁移
.PHONY: db-migrate
db-migrate:
	mysql -u root -p cese < docker/init.sql

# 生成 API 文档
.PHONY: docs
docs:
	swag init -g cmd/main.go -o docs/

# 开发环境启动
.PHONY: dev
dev:
	air -c .air.toml

# 生产环境部署
.PHONY: deploy
deploy: clean deps test build
	@echo "部署到生产环境..."
	# 这里添加具体的部署命令

# 健康检查
.PHONY: health
health:
	curl -f http://localhost:8080/health || exit 1

# 性能测试
.PHONY: perf-test
perf-test:
	@echo "运行性能测试..."
	$(GOTEST) -v -run=TestLoadTest ./test/

# 安全扫描
.PHONY: security
security:
	gosec ./...

# 依赖检查
.PHONY: deps-check
deps-check:
	$(GOMOD) verify
	nancy sleuth

# 帮助信息
.PHONY: help
help:
	@echo "CESE 后端服务 Makefile"
	@echo ""
	@echo "可用命令:"
	@echo "  all              - 清理、安装依赖、测试、构建"
	@echo "  deps             - 安装 Go 依赖"
	@echo "  run              - 运行应用"
	@echo "  build            - 构建 Linux 版本"
	@echo "  build-windows    - 构建 Windows 版本"
	@echo "  build-darwin     - 构建 macOS 版本"
	@echo "  test             - 运行单元测试"
	@echo "  test-integration - 运行集成测试"
	@echo "  test-benchmark   - 运行压力测试"
	@echo "  test-all         - 运行所有测试"
	@echo "  test-coverage    - 生成测试覆盖率报告"
	@echo "  fmt              - 格式化代码"
	@echo "  vet              - 代码检查"
	@echo "  lint             - 静态分析"
	@echo "  clean            - 清理构建文件"
	@echo "  docker-build     - 构建 Docker 镜像"
	@echo "  docker-run       - 运行 Docker 容器"
	@echo "  docker-stop      - 停止 Docker 容器"
	@echo "  docker-clean     - 清理 Docker 镜像"
	@echo "  db-migrate       - 数据库迁移"
	@echo "  docs             - 生成 API 文档"
	@echo "  dev              - 开发环境启动"
	@echo "  deploy           - 生产环境部署"
	@echo "  health           - 健康检查"
	@echo "  perf-test        - 性能测试"
	@echo "  security         - 安全扫描"
	@echo "  deps-check       - 依赖检查"
	@echo "  help             - 显示帮助信息"
