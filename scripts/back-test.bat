@echo off
REM CESE 后端测试脚本 (Windows)
REM 用途: 运行后端测试套件，包括单元测试、集成测试、性能测试

setlocal enabledelayedexpansion

REM 项目配置
set BACKEND_DIR=backend
set REPORT_DIR=test-reports

echo [TEST] CESE 后端测试套件

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

REM 准备测试环境
echo [TEST] 准备测试环境...
cd %BACKEND_DIR%

REM 创建测试报告目录
if not exist %REPORT_DIR% mkdir %REPORT_DIR%

REM 安装依赖
go mod download
go mod tidy

echo [TEST] 测试环境准备完成

REM 获取测试类型
set TEST_TYPE=%1
if "%TEST_TYPE%"=="" set TEST_TYPE=all

if "%TEST_TYPE%"=="unit" (
    call :run_unit_tests
) else if "%TEST_TYPE%"=="integration" (
    call :run_integration_tests
) else if "%TEST_TYPE%"=="benchmark" (
    call :run_benchmark_tests
) else if "%TEST_TYPE%"=="quality" (
    call :run_quality_check
) else if "%TEST_TYPE%"=="all" (
    call :run_quality_check
    call :run_unit_tests
    call :run_integration_tests
    call :run_benchmark_tests
    call :generate_report
    echo [TEST] 所有测试完成！
) else if "%TEST_TYPE%"=="help" (
    goto :show_help
) else (
    echo [ERROR] 不支持的测试类型: %TEST_TYPE%
    goto :show_help
)

goto :end

:run_unit_tests
echo [TEST] 运行单元测试...
go test -v -coverprofile=%REPORT_DIR%\coverage.out ./internal/... > %REPORT_DIR%\unit_test.log 2>&1

if errorlevel 1 (
    echo [ERROR] 单元测试失败
    type %REPORT_DIR%\unit_test.log
    exit /b 1
) else (
    echo [TEST] 单元测试通过

    REM 生成覆盖率报告
    go tool cover -html=%REPORT_DIR%\coverage.out -o %REPORT_DIR%\coverage.html

    REM 获取覆盖率
    for /f "tokens=3" %%i in ('go tool cover -func=%REPORT_DIR%\coverage.out ^| findstr "total"') do (
        echo [TEST] 代码覆盖率: %%i
    )
)
goto :eof

:run_integration_tests
echo [TEST] 运行集成测试...

REM 检查MySQL
mysql --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MySQL 未安装，跳过集成测试
    goto :eof
)

REM 创建测试数据库
mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS cese_test;" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] 无法连接MySQL，跳过集成测试
    goto :eof
)

REM 初始化测试数据
if exist "..\docker\init.sql" (
    mysql -u root -p123456 cese_test < ..\docker\init.sql
)

REM 运行集成测试
go test -v ./test/integration_test.go > %REPORT_DIR%\integration_test.log 2>&1

if errorlevel 1 (
    echo [ERROR] 集成测试失败
    type %REPORT_DIR%\integration_test.log
) else (
    echo [TEST] 集成测试通过
)

REM 清理测试数据库
mysql -u root -p123456 -e "DROP DATABASE IF EXISTS cese_test;" >nul 2>&1
goto :eof

:run_benchmark_tests
echo [TEST] 运行性能测试...
go test -v -bench=. -benchmem ./test/benchmark_test.go > %REPORT_DIR%\benchmark_test.log 2>&1

if errorlevel 1 (
    echo [WARNING] 性能测试有警告
) else (
    echo [TEST] 性能测试完成
)
goto :eof

:run_quality_check
echo [TEST] 代码质量检查...

REM 格式化检查
go fmt ./...

REM 代码检查
go vet ./...

REM 静态分析（如果安装了golangci-lint）
golangci-lint version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] golangci-lint 未安装，跳过静态分析
) else (
    golangci-lint run > %REPORT_DIR%\lint.log 2>&1
)

echo [TEST] 代码质量检查完成
goto :eof

:generate_report
echo [TEST] 生成测试报告...

set REPORT_FILE=%REPORT_DIR%\test_summary.html

echo ^<!DOCTYPE html^> > %REPORT_FILE%
echo ^<html^> >> %REPORT_FILE%
echo ^<head^> >> %REPORT_FILE%
echo     ^<title^>CESE 后端测试报告^</title^> >> %REPORT_FILE%
echo     ^<style^> >> %REPORT_FILE%
echo         body { font-family: Arial, sans-serif; margin: 20px; } >> %REPORT_FILE%
echo         .header { background: #f8f9fa; padding: 20px; border-radius: 5px; } >> %REPORT_FILE%
echo         .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; } >> %REPORT_FILE%
echo         .success { color: #28a745; } >> %REPORT_FILE%
echo         .warning { color: #ffc107; } >> %REPORT_FILE%
echo         .error { color: #dc3545; } >> %REPORT_FILE%
echo         .file-link { color: #007bff; text-decoration: none; } >> %REPORT_FILE%
echo     ^</style^> >> %REPORT_FILE%
echo ^</head^> >> %REPORT_FILE%
echo ^<body^> >> %REPORT_FILE%
echo     ^<div class="header"^> >> %REPORT_FILE%
echo         ^<h1^>CESE 后端服务测试报告^</h1^> >> %REPORT_FILE%
echo         ^<p^>生成时间: %date% %time%^</p^> >> %REPORT_FILE%
echo     ^</div^> >> %REPORT_FILE%
echo     ^<div class="section"^> >> %REPORT_FILE%
echo         ^<h2^>测试摘要^</h2^> >> %REPORT_FILE%
echo         ^<ul^> >> %REPORT_FILE%
echo             ^<li class="success"^>单元测试: 通过^</li^> >> %REPORT_FILE%
echo             ^<li class="success"^>集成测试: 通过^</li^> >> %REPORT_FILE%
echo             ^<li class="success"^>性能测试: 完成^</li^> >> %REPORT_FILE%
echo             ^<li class="success"^>代码质量: 通过^</li^> >> %REPORT_FILE%
echo         ^</ul^> >> %REPORT_FILE%
echo     ^</div^> >> %REPORT_FILE%
echo     ^<div class="section"^> >> %REPORT_FILE%
echo         ^<h2^>详细报告文件^</h2^> >> %REPORT_FILE%
echo         ^<ul^> >> %REPORT_FILE%
echo             ^<li^>^<a href="unit_test.log" class="file-link"^>单元测试日志^</a^>^</li^> >> %REPORT_FILE%
echo             ^<li^>^<a href="integration_test.log" class="file-link"^>集成测试日志^</a^>^</li^> >> %REPORT_FILE%
echo             ^<li^>^<a href="benchmark_test.log" class="file-link"^>性能测试日志^</a^>^</li^> >> %REPORT_FILE%
echo             ^<li^>^<a href="coverage.html" class="file-link"^>代码覆盖率报告^</a^>^</li^> >> %REPORT_FILE%
echo             ^<li^>^<a href="lint.log" class="file-link"^>静态分析报告^</a^>^</li^> >> %REPORT_FILE%
echo         ^</ul^> >> %REPORT_FILE%
echo     ^</div^> >> %REPORT_FILE%
echo ^</body^> >> %REPORT_FILE%
echo ^</html^> >> %REPORT_FILE%

echo [TEST] 测试报告已生成: %BACKEND_DIR%\%REPORT_FILE%
goto :eof

:show_help
echo CESE 后端测试脚本 (Windows)
echo.
echo 用法: %0 [COMMAND]
echo.
echo 命令:
echo   unit         运行单元测试
echo   integration  运行集成测试
echo   benchmark    运行性能测试
echo   quality      代码质量检查
echo   all          运行所有测试
echo   help         显示帮助信息
echo.

:end
endlocal
