@echo off
REM CESE 后端构建脚本 (Windows)
REM 用途: 编译Go后端服务，支持多平台构建

setlocal enabledelayedexpansion

REM 项目配置
set APP_NAME=cese-backend
set VERSION=1.0.0
set BUILD_DIR=build
set BACKEND_DIR=backend

REM 进入后端目录
cd %BACKEND_DIR%

echo [BUILD] 开始构建 CESE 后端服务...

REM 检查Go环境
go version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Go 未安装，请先安装 Go 1.20+
    exit /b 1
)

echo [BUILD] Go 环境检查通过

REM 安装依赖
echo [BUILD] 安装依赖...
go mod download
go mod tidy
echo [BUILD] 依赖安装完成

REM 代码检查
echo [BUILD] 代码质量检查...
go fmt ./...
go vet ./...
echo [BUILD] 代码检查完成

REM 创建构建目录
if not exist %BUILD_DIR% mkdir %BUILD_DIR%

REM 根据参数决定构建目标
set TARGET=%1
if "%TARGET%"=="" set TARGET=windows

if "%TARGET%"=="windows" (
    echo [BUILD] 构建 Windows 版本...
    set CGO_ENABLED=0
    set GOOS=windows
    set GOARCH=amd64
    go build -a -installsuffix cgo -ldflags "-X main.version=%VERSION%" -o %BUILD_DIR%\%APP_NAME%.exe cmd\main.go
    echo [BUILD] Windows 构建完成: %BUILD_DIR%\%APP_NAME%.exe
) else if "%TARGET%"=="linux" (
    echo [BUILD] 构建 Linux 版本...
    set CGO_ENABLED=0
    set GOOS=linux
    set GOARCH=amd64
    go build -a -installsuffix cgo -ldflags "-X main.version=%VERSION%" -o %BUILD_DIR%\%APP_NAME% cmd\main.go
    echo [BUILD] Linux 构建完成: %BUILD_DIR%\%APP_NAME%
) else if "%TARGET%"=="darwin" (
    echo [BUILD] 构建 macOS 版本...
    set CGO_ENABLED=0
    set GOOS=darwin
    set GOARCH=amd64
    go build -a -installsuffix cgo -ldflags "-X main.version=%VERSION%" -o %BUILD_DIR%\%APP_NAME%-darwin cmd\main.go
    echo [BUILD] macOS 构建完成: %BUILD_DIR%\%APP_NAME%-darwin
) else if "%TARGET%"=="all" (
    echo [BUILD] 构建所有平台版本...

    REM Windows
    set CGO_ENABLED=0
    set GOOS=windows
    set GOARCH=amd64
    go build -a -installsuffix cgo -ldflags "-X main.version=%VERSION%" -o %BUILD_DIR%\%APP_NAME%.exe cmd\main.go

    REM Linux
    set GOOS=linux
    go build -a -installsuffix cgo -ldflags "-X main.version=%VERSION%" -o %BUILD_DIR%\%APP_NAME% cmd\main.go

    REM macOS
    set GOOS=darwin
    go build -a -installsuffix cgo -ldflags "-X main.version=%VERSION%" -o %BUILD_DIR%\%APP_NAME%-darwin cmd\main.go

    echo [BUILD] 所有平台构建完成
) else (
    echo [ERROR] 不支持的构建目标: %TARGET%
    echo 支持的目标: windows, linux, darwin, all
    exit /b 1
)

echo [BUILD] 构建完成！

endlocal
