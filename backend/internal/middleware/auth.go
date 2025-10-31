package middleware

import (
	"context"
	"strings"

	"cese-backend/internal/config"
	"cese-backend/internal/utils"
	"cese-backend/pkg/response"

	"github.com/cloudwego/hertz/pkg/app"
)

// AuthMiddleware JWT认证中间件
func AuthMiddleware(cfg *config.Config) app.HandlerFunc {
	return func(ctx context.Context, c *app.RequestContext) {
		// 获取Authorization头
		authHeader := string(c.GetHeader("Authorization"))
		if authHeader == "" {
			response.Error(c, response.CodeTokenMissing)
			c.Abort()
			return
		}

		// 检查Bearer前缀
		if !strings.HasPrefix(authHeader, "Bearer ") {
			response.Error(c, response.CodeInvalidToken)
			c.Abort()
			return
		}

		// 提取Token
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			response.Error(c, response.CodeTokenMissing)
			c.Abort()
			return
		}

		// 验证Token
		claims, err := utils.ParseToken(token, cfg.JWT.Secret)
		if err != nil {
			response.Error(c, response.CodeInvalidToken)
			c.Abort()
			return
		}

		// 将用户信息存储到上下文中
		c.Set("user_id", claims.UserID)
		c.Set("phone", claims.Phone)

		c.Next(ctx)
	}
}

// GetUserID 从上下文中获取用户ID
func GetUserID(c *app.RequestContext) uint64 {
	if userID, exists := c.Get("user_id"); exists {
		if id, ok := userID.(uint64); ok {
			return id
		}
	}
	return 0
}

// GetPhone 从上下文中获取用户手机号
func GetPhone(c *app.RequestContext) string {
	if phone, exists := c.Get("phone"); exists {
		if p, ok := phone.(string); ok {
			return p
		}
	}
	return ""
}
