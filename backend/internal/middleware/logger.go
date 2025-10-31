package middleware

import (
	"context"
	"time"

	"cese-backend/pkg/logger"

	"github.com/cloudwego/hertz/pkg/app"
	"github.com/sirupsen/logrus"
)

// LoggerMiddleware 日志中间件
func LoggerMiddleware() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		start := time.Now()

		// 处理请求
		c.Next(ctx)

		// 计算处理时间
		duration := time.Since(start)

		// 记录请求日志
		logger.GetLogger().WithFields(logrus.Fields{
			"method":     string(c.Method()),
			"path":       string(c.Path()),
			"status":     c.Response.StatusCode(),
			"duration":   duration.String(),
			"ip":         c.ClientIP(),
			"user_agent": string(c.UserAgent()),
		}).Info("HTTP Request")
	}
}

// ErrorLoggerMiddleware 错误日志中间件
func ErrorLoggerMiddleware() app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		defer func() {
			if err := recover(); err != nil {
				logger.GetLogger().WithFields(logrus.Fields{
					"method": string(c.Method()),
					"path":   string(c.Path()),
					"ip":     c.ClientIP(),
					"error":  err,
				}).Error("Panic recovered")

				// 返回500错误
				c.JSON(500, map[string]interface{}{
					"code":    500,
					"message": "内部服务器错误",
				})
			}
		}()

		c.Next(ctx)
	}
}
