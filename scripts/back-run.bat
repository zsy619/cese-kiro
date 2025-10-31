@echo off
REM CESE 后端运行脚本 (Windows)
REM 用途: 启动Go后端服务，支持开发和生产模式

setlocal enabledelayedexpansion

REM 项目配置
set BACKEND_DIR=backend
set APP_NAME=cese-backend
set BUILD_DIR=build

echo [RUN] CESE 后端服务启动脚本

REM 检查环境
go version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Go 未安装
    exit /b 1
)

if not exist %BACKEND_DIR% (
    echo [ERROR] 后端目录不存在: %BACKEND_DIR%
    exit /b 1
)

REM 获取运行模式
set MODE=%1
if "%MODE%"=="" set MODE=dev

if "%MODE%"=="dev" (
    echo [RUN] 启动开发模式...
    cd %BACKEND_DIR%

    REM 检查是否安装了air
    air version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] air 未安装，使用普通模式启动
        echo [RUN] 提示: 安装 air 可获得热重载功能: go install github.com/cosmtrek/air@latest
        go run cmd\main.go
    ) else (
        echo [RUN] 使用 air 热重载启动...
        air -c .air.toml
    )

) else if "%MODE%"=="prod" (
    echo [RUN] 启动生产模式...

    REM 检查是否已构建
    if not exist %BACKEND_DIR%\%BUILD_DIR%\%APP_NAME%.exe (
        echo [WARNING] 未找到构建文件，开始构建...
        call scripts\back-build.bat windows
    )

    cd %BACKEND_DIR%
    echo [RUN] 启动服务: %BUILD_DIR%\%APP_NAME%.exe
    %BUILD_DIR%\%APP_NAME%.exe

) else if "%MODE%"=="service" (
    echo [RUN] 安装并启动Windows服务...

    REM 检查是否已构建
    if not exist %BACKEND_DIR%\%BUILD_DIR%\%APP_NAME%.exe (
        echo [WARNING] 未找到构建文件，开始构建...
        call scripts\back-build.bat windows
    )

    cd %BACKEND_DIR%

    REM 创建日志目录
    if not exist logs mkdir logs

    REM 使用sc命令创建服务
    sc create CESEBackend binPath= "%CD%\%BUILD_DIR%\%APP_NAME%.exe" start= auto
    sc description CESEBackend "CESE 上下文工程六要素后端服务"

    REM 启动服务
    sc start CESEBackend

    echo [RUN] Windows服务已安装并启动
    echo [RUN] 服务名称: CESEBackend
    echo [RUN] 使用 'sc stop CESEBackend' 停止服务
    echo [RUN] 使用 'sc delete CESEBackend' 删除服务

) else if "%MODE%"=="stop" (
    echo [RUN] 停止服务...

    REM 停止Windows服务
    sc stop CESEBackend >nul 2>&1

    REM 查找并终止进程
    for /f "tokens=2" %%i in ('tasklist /fi "imagename eq %APP_NAME%.exe" /fo csv ^| find /i "%APP_NAME%.exe"') do (
        echo [RUN] 终止进程: %%i
        taskkill /pid %%i /f
    )

    echo [RUN] 服务已停止

) else if "%MODE%"=="help" (
    goto :show_help
) else (
    echo [ERROR] 不支持的运行模式: %MODE%
    goto :show_help
)

goto :end

:show_help
echo CESE 后端运行脚本 (Windows)
echo.
echo 用法: %0 [COMMAND]
echo.
echo 命令:
echo   dev      开发模式运行（支持热重载）
echo   prod     生产模式运行
echo   service  安装并启动Windows服务
echo   stop     停止服务
echo   help     显示帮助信息
echo.

:end
endlocal
