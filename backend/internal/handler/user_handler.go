package handler

import (
	"context"

	"cese-backend/internal/middleware"
	"cese-backend/internal/model"
	"cese-backend/internal/service"
	"cese-backend/pkg/response"

	"github.com/cloudwego/hertz/pkg/app"
)

// UserHandler 用户处理器
type UserHandler struct {
	userService service.UserService
}

// NewUserHandler 创建用户处理器实例
func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// Register 用户注册
// @Summary 用户注册
// @Description 用户注册接口
// @Tags 用户管理
// @Accept json
// @Produce json
// @Param request body model.UserRegisterRequest true "注册请求"
// @Success 200 {object} response.Response{data=model.UserResponse} "注册成功"
// @Failure 400 {object} response.Response "参数错误"
// @Router /api/v1/user/register [post]
func (h *UserHandler) Register(ctx context.Context, c *app.RequestContext) {
	var req model.UserRegisterRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	user, err := h.userService.Register(&req)
	if err != nil {
		switch err.Error() {
		case "手机号格式错误":
			response.Error(c, response.CodeInvalidPhone)
		case "密码强度不够":
			response.Error(c, response.CodeWeakPassword)
		case "用户已存在":
			response.Error(c, response.CodeUserExists)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "注册成功", user)
}

// Login 用户登录
// @Summary 用户登录
// @Description 用户登录接口
// @Tags 用户管理
// @Accept json
// @Produce json
// @Param request body model.UserLoginRequest true "登录请求"
// @Success 200 {object} response.Response{data=model.LoginResponse} "登录成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "认证失败"
// @Router /api/v1/user/login [post]
func (h *UserHandler) Login(ctx context.Context, c *app.RequestContext) {
	var req model.UserLoginRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	loginResp, err := h.userService.Login(&req)
	if err != nil {
		switch err.Error() {
		case "手机号格式错误":
			response.Error(c, response.CodeInvalidPhone)
		case "用户不存在":
			response.Error(c, response.CodeUserNotFound)
		case "密码错误":
			response.Error(c, response.CodeInvalidPassword)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "登录成功", loginResp)
}

// ChangePassword 修改密码
// @Summary 修改密码
// @Description 修改用户密码
// @Tags 用户管理
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body model.UserChangePasswordRequest true "修改密码请求"
// @Success 200 {object} response.Response "修改成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "未授权"
// @Router /api/v1/user/password [put]
func (h *UserHandler) ChangePassword(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	var req model.UserChangePasswordRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	err := h.userService.ChangePassword(userID, &req)
	if err != nil {
		switch err.Error() {
		case "新密码强度不够":
			response.Error(c, response.CodeWeakPassword)
		case "用户不存在":
			response.Error(c, response.CodeUserNotFound)
		case "旧密码错误":
			response.Error(c, response.CodeInvalidPassword)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "密码修改成功", nil)
}

// GetProfile 获取用户信息
// @Summary 获取用户信息
// @Description 获取当前登录用户的信息
// @Tags 用户管理
// @Produce json
// @Security BearerAuth
// @Success 200 {object} response.Response{data=model.UserResponse} "获取成功"
// @Failure 401 {object} response.Response "未授权"
// @Router /api/v1/user/profile [get]
func (h *UserHandler) GetProfile(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	user, err := h.userService.GetProfile(userID)
	if err != nil {
		switch err.Error() {
		case "用户不存在":
			response.Error(c, response.CodeUserNotFound)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "获取成功", user)
}

// RefreshToken 刷新Token
// @Summary 刷新Token
// @Description 使用刷新Token获取新的访问Token
// @Tags 用户管理
// @Accept json
// @Produce json
// @Param request body model.RefreshTokenRequest true "刷新Token请求"
// @Success 200 {object} response.Response{data=model.RefreshTokenResponse} "刷新成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "Token无效"
// @Router /api/v1/user/refresh [post]
func (h *UserHandler) RefreshToken(ctx context.Context, c *app.RequestContext) {
	var req model.RefreshTokenRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	refreshResp, err := h.userService.RefreshToken(&req)
	if err != nil {
		switch err.Error() {
		case "刷新Token失败":
			response.Error(c, response.CodeInvalidToken)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "Token刷新成功", refreshResp)
}
