package middleware

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"

	"cese-backend/internal/config"
	"cese-backend/pkg/response"

	"github.com/cloudwego/hertz/pkg/app"
)

// RateLimiter 限流器接口
type RateLimiter interface {
	Allow(key string, limit int, window time.Duration) bool
	Reset(key string)
}

// MemoryRateLimiter 内存限流器
type MemoryRateLimiter struct {
	mu      sync.RWMutex
	buckets map[string]*bucket
}

// bucket 令牌桶
type bucket struct {
	tokens     int
	capacity   int
	lastRefill time.Time
	window     time.Duration
}

// NewMemoryRateLimiter 创建内存限流器
func NewMemoryRateLimiter() *MemoryRateLimiter {
	limiter := &MemoryRateLimiter{
		buckets: make(map[string]*bucket),
	}

	// 启动清理协程
	go limiter.cleanup()

	return limiter
}

// Allow 检查是否允许请求
func (m *MemoryRateLimiter) Allow(key string, limit int, window time.Duration) bool {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now()
	b, exists := m.buckets[key]

	if !exists {
		// 创建新的令牌桶
		b = &bucket{
			tokens:     limit - 1, // 消耗一个令牌
			capacity:   limit,
			lastRefill: now,
			window:     window,
		}
		m.buckets[key] = b
		return true
	}

	// 计算需要补充的令牌数
	elapsed := now.Sub(b.lastRefill)
	if elapsed >= b.window {
		// 时间窗口已过，重置令牌桶
		b.tokens = b.capacity - 1
		b.lastRefill = now
		return true
	}

	// 检查是否有可用令牌
	if b.tokens > 0 {
		b.tokens--
		return true
	}

	return false
}

// Reset 重置限流器
func (m *MemoryRateLimiter) Reset(key string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.buckets, key)
}

// cleanup 清理过期的令牌桶
func (m *MemoryRateLimiter) cleanup() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		m.mu.Lock()
		now := time.Now()
		for key, b := range m.buckets {
			if now.Sub(b.lastRefill) > b.window*2 {
				delete(m.buckets, key)
			}
		}
		m.mu.Unlock()
	}
}

// RateLimitConfig 限流配置
type RateLimitConfig struct {
	Requests int           `json:"requests"`
	Window   time.Duration `json:"window"`
}

// parseWindow 解析时间窗口
func parseWindow(window string) time.Duration {
	if strings.HasSuffix(window, "s") {
		if seconds, err := strconv.Atoi(strings.TrimSuffix(window, "s")); err == nil {
			return time.Duration(seconds) * time.Second
		}
	}
	if strings.HasSuffix(window, "m") {
		if minutes, err := strconv.Atoi(strings.TrimSuffix(window, "m")); err == nil {
			return time.Duration(minutes) * time.Minute
		}
	}
	if strings.HasSuffix(window, "h") {
		if hours, err := strconv.Atoi(strings.TrimSuffix(window, "h")); err == nil {
			return time.Duration(hours) * time.Hour
		}
	}
	return time.Minute // 默认1分钟
}

// RateLimitMiddleware 限流中间件
func RateLimitMiddleware(cfg *config.Config) app.HandlerFunc {
	limiter := NewMemoryRateLimiter()

	return func(ctx context.Context, c *app.RequestContext) {
		// 如果限流未启用，直接通过
		if !cfg.RateLimit.Enabled {
			c.Next(ctx)
			return
		}

		// 获取客户端IP
		clientIP := c.ClientIP()
		path := string(c.Path())

		// 构建限流键
		key := fmt.Sprintf("rate_limit:%s:%s", clientIP, path)

		// 获取该路径的限流配置
		var limitConfig RateLimitConfig
		if pathConfig, exists := cfg.RateLimit.APIs[path]; exists {
			limitConfig = RateLimitConfig{
				Requests: pathConfig.Requests,
				Window:   parseWindow(pathConfig.Window),
			}
		} else if defaultConfig, exists := cfg.RateLimit.APIs["default"]; exists {
			limitConfig = RateLimitConfig{
				Requests: defaultConfig.Requests,
				Window:   parseWindow(defaultConfig.Window),
			}
		} else {
			// 使用全局配置
			limitConfig = RateLimitConfig{
				Requests: cfg.RateLimit.Global.Requests,
				Window:   parseWindow(cfg.RateLimit.Global.Window),
			}
		}

		// 检查是否允许请求
		if !limiter.Allow(key, limitConfig.Requests, limitConfig.Window) {
			// 设置限流响应头
			c.Header("X-RateLimit-Limit", strconv.Itoa(limitConfig.Requests))
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("X-RateLimit-Reset", strconv.FormatInt(time.Now().Add(limitConfig.Window).Unix(), 10))

			response.ErrorWithMessage(c, 429, "请求过于频繁，请稍后再试")
			c.Abort()
			return
		}

		// 设置响应头
		c.Header("X-RateLimit-Limit", strconv.Itoa(limitConfig.Requests))

		c.Next(ctx)
	}
}

// IPRateLimitMiddleware IP限流中间件
func IPRateLimitMiddleware(requests int, window time.Duration) app.HandlerFunc {
	limiter := NewMemoryRateLimiter()

	return func(ctx context.Context, c *app.RequestContext) {
		clientIP := c.ClientIP()
		key := fmt.Sprintf("ip_rate_limit:%s", clientIP)

		if !limiter.Allow(key, requests, window) {
			c.Header("X-RateLimit-Limit", strconv.Itoa(requests))
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("X-RateLimit-Reset", strconv.FormatInt(time.Now().Add(window).Unix(), 10))

			response.ErrorWithMessage(c, 429, "IP请求过于频繁，请稍后再试")
			c.Abort()
			return
		}

		c.Next(ctx)
	}
}

// UserRateLimitMiddleware 用户限流中间件
func UserRateLimitMiddleware(requests int, window time.Duration) app.HandlerFunc {
	limiter := NewMemoryRateLimiter()

	return func(ctx context.Context, c *app.RequestContext) {
		userID := GetUserID(c)
		if userID == 0 {
			// 未认证用户，跳过用户限流
			c.Next(ctx)
			return
		}

		key := fmt.Sprintf("user_rate_limit:%d", userID)

		if !limiter.Allow(key, requests, window) {
			c.Header("X-RateLimit-Limit", strconv.Itoa(requests))
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("X-RateLimit-Reset", strconv.FormatInt(time.Now().Add(window).Unix(), 10))

			response.ErrorWithMessage(c, 429, "用户请求过于频繁，请稍后再试")
			c.Abort()
			return
		}

		c.Next(ctx)
	}
}
