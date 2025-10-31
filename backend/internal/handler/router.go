package handler

import (
	"cese-backend/internal/config"
	"cese-backend/internal/middleware"
	"cese-backend/internal/service"
	"context"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/cloudwego/hertz/pkg/app/server"
)

// SetupRoutes 设置路由
func SetupRoutes(
	h *server.Hertz,
	cfg *config.Config,
	userService service.UserService,
	elementService service.ContextElementService,
) {
	// 创建处理器实例
	userHandler := NewUserHandler(userService)
	elementHandler := NewContextElementHandler(elementService)

	// 添加全局中间件
	h.Use(middleware.ErrorLoggerMiddleware())
	h.Use(middleware.LoggerMiddleware())
	h.Use(middleware.RateLimitMiddleware(cfg))

	// API路由组
	api := h.Group("/api")
	v1 := api.Group("/v1")

	// 用户相关路由（无需认证）
	userGroup := v1.Group("/user")
	{
		userGroup.POST("/register", userHandler.Register)
		userGroup.POST("/login", userHandler.Login)
		userGroup.POST("/refresh", userHandler.RefreshToken)
	}

	// 需要认证的用户路由
	authUserGroup := v1.Group("/user")
	authUserGroup.Use(middleware.AuthMiddleware(cfg))
	{
		authUserGroup.PUT("/password", userHandler.ChangePassword)
		authUserGroup.GET("/profile", userHandler.GetProfile)
	}

	// 六要素相关路由（需要认证）
	elementGroup := v1.Group("/context-elements")
	elementGroup.Use(middleware.AuthMiddleware(cfg))
	{
		elementGroup.POST("/", elementHandler.Create)
		elementGroup.GET("/", elementHandler.GetList)
		elementGroup.GET("/:id", elementHandler.GetByID)
		elementGroup.PUT("/:id", elementHandler.Update)
		elementGroup.DELETE("/:id", elementHandler.Delete)
	}

	// 健康检查路由
	h.GET("/health", func(ctx context.Context, c *app.RequestContext) {
		c.JSON(200, map[string]interface{}{
			"status":  "ok",
			"message": "CESE Backend Service is running",
		})
	})

	// 根路径
	h.GET("/", func(ctx context.Context, c *app.RequestContext) {
		c.JSON(200, map[string]interface{}{
			"name":    "CESE Backend API",
			"version": "1.0.0",
			"message": "上下文工程六要素工具后端服务",
		})
	})
}
