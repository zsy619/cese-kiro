package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"cese-backend/internal/config"
	"cese-backend/internal/handler"
	"cese-backend/internal/repository"
	"cese-backend/internal/service"
	"cese-backend/pkg/logger"

	"github.com/cloudwego/hertz/pkg/app/server"
)

func main() {
	// 加载配置
	cfg, err := config.LoadConfig("configs/config.yaml")
	if err != nil {
		log.Fatalf("加载配置失败: %v", err)
	}

	// 初始化日志
	if err := logger.InitLogger(cfg); err != nil {
		log.Fatalf("初始化日志失败: %v", err)
	}

	logger.GetLogger().Info("正在启动 CESE 后端服务...")

	// 初始化数据库
	if err := repository.InitDatabase(cfg); err != nil {
		logger.GetLogger().Fatalf("初始化数据库失败: %v", err)
	}
	logger.GetLogger().Info("数据库连接成功")

	// 创建Repository实例
	userRepo := repository.NewUserRepository(repository.GetDB())
	elementRepo := repository.NewContextElementRepository(repository.GetDB())

	// 创建Service实例
	userService := service.NewUserService(userRepo, cfg)
	elementService := service.NewContextElementService(elementRepo, cfg)

	// 创建Hertz服务器
	h := server.Default(server.WithHostPorts(cfg.GetServerAddr()))

	// 设置路由
	handler.SetupRoutes(h, cfg, userService, elementService)

	// 启动服务器
	go func() {
		logger.GetLogger().Infof("服务器启动在 %s", cfg.GetServerAddr())
		if err := h.Spin(); err != nil {
			logger.GetLogger().Fatalf("服务器启动失败: %v", err)
		}
	}()

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.GetLogger().Info("正在关闭服务器...")

	// 关闭数据库连接
	if err := repository.CloseDatabase(); err != nil {
		logger.GetLogger().Errorf("关闭数据库连接失败: %v", err)
	}

	logger.GetLogger().Info("服务器已关闭")
}
