package response

import (
	"net/http"

	"github.com/cloudwego/hertz/pkg/app"
)

// Response 统一响应结构
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// PageResponse 分页响应结构
type PageResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
	Total   int64       `json:"total"`
	Page    int         `json:"page"`
	Size    int         `json:"size"`
}

// 错误码定义
const (
	// 通用错误码
	CodeSuccess       = 200 // 成功
	CodeInvalidParams = 400 // 参数错误
	CodeUnauthorized  = 401 // 未授权
	CodeForbidden     = 403 // 禁止访问
	CodeNotFound      = 404 // 资源不存在
	CodeInternalError = 500 // 内部错误

	// 用户相关错误码
	CodeUserExists      = 1001 // 用户已存在
	CodeUserNotFound    = 1002 // 用户不存在
	CodeInvalidPassword = 1003 // 密码错误
	CodeWeakPassword    = 1004 // 密码强度不够
	CodeInvalidPhone    = 1005 // 手机号格式错误

	// 六要素相关错误码
	CodeElementNotFound = 2001 // 六要素不存在
	CodeElementExists   = 2002 // 六要素已存在
	CodeInvalidElement  = 2003 // 六要素参数错误

	// JWT相关错误码
	CodeInvalidToken = 3001 // Token无效
	CodeTokenExpired = 3002 // Token过期
	CodeTokenMissing = 3003 // Token缺失
)

// 错误消息映射
var codeMessages = map[int]string{
	CodeSuccess:       "成功",
	CodeInvalidParams: "参数错误",
	CodeUnauthorized:  "未授权",
	CodeForbidden:     "禁止访问",
	CodeNotFound:      "资源不存在",
	CodeInternalError: "内部错误",

	CodeUserExists:      "用户已存在",
	CodeUserNotFound:    "用户不存在",
	CodeInvalidPassword: "密码错误",
	CodeWeakPassword:    "密码强度不够",
	CodeInvalidPhone:    "手机号格式错误",

	CodeElementNotFound: "六要素不存在",
	CodeElementExists:   "六要素已存在",
	CodeInvalidElement:  "六要素参数错误",

	CodeInvalidToken: "Token无效",
	CodeTokenExpired: "Token过期",
	CodeTokenMissing: "Token缺失",
}

// GetMessage 根据错误码获取错误消息
func GetMessage(code int) string {
	if msg, ok := codeMessages[code]; ok {
		return msg
	}
	return "未知错误"
}

// Success 成功响应
func Success(c *app.RequestContext, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: GetMessage(CodeSuccess),
		Data:    data,
	})
}

// SuccessWithMessage 成功响应（自定义消息）
func SuccessWithMessage(c *app.RequestContext, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    CodeSuccess,
		Message: message,
		Data:    data,
	})
}

// Error 错误响应
func Error(c *app.RequestContext, code int) {
	httpStatus := getHTTPStatus(code)
	c.JSON(httpStatus, Response{
		Code:    code,
		Message: GetMessage(code),
	})
}

// ErrorWithMessage 错误响应（自定义消息）
func ErrorWithMessage(c *app.RequestContext, code int, message string) {
	httpStatus := getHTTPStatus(code)
	c.JSON(httpStatus, Response{
		Code:    code,
		Message: message,
	})
}

// ErrorWithData 错误响应（包含数据）
func ErrorWithData(c *app.RequestContext, code int, data interface{}) {
	httpStatus := getHTTPStatus(code)
	c.JSON(httpStatus, Response{
		Code:    code,
		Message: GetMessage(code),
		Data:    data,
	})
}

// PageSuccess 分页成功响应
func PageSuccess(c *app.RequestContext, data interface{}, total int64, page, size int) {
	c.JSON(http.StatusOK, PageResponse{
		Code:    CodeSuccess,
		Message: GetMessage(CodeSuccess),
		Data:    data,
		Total:   total,
		Page:    page,
		Size:    size,
	})
}

// PageSuccessWithMessage 分页成功响应（自定义消息）
func PageSuccessWithMessage(c *app.RequestContext, message string, data interface{}, total int64, page, size int) {
	c.JSON(http.StatusOK, PageResponse{
		Code:    CodeSuccess,
		Message: message,
		Data:    data,
		Total:   total,
		Page:    page,
		Size:    size,
	})
}

// getHTTPStatus 根据业务错误码获取HTTP状态码
func getHTTPStatus(code int) int {
	switch {
	case code == CodeSuccess:
		return http.StatusOK
	case code >= 400 && code < 500:
		return code
	case code >= 1000 && code < 2000:
		return http.StatusBadRequest
	case code >= 2000 && code < 3000:
		return http.StatusNotFound
	case code >= 3000 && code < 4000:
		return http.StatusUnauthorized
	default:
		return http.StatusInternalServerError
	}
}
