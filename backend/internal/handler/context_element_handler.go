package handler

import (
	"context"
	"strconv"

	"cese-backend/internal/middleware"
	"cese-backend/internal/model"
	"cese-backend/internal/service"
	"cese-backend/pkg/response"

	"github.com/cloudwego/hertz/pkg/app"
)

// ContextElementHandler 六要素处理器
type ContextElementHandler struct {
	elementService service.ContextElementService
}

// NewContextElementHandler 创建六要素处理器实例
func NewContextElementHandler(elementService service.ContextElementService) *ContextElementHandler {
	return &ContextElementHandler{
		elementService: elementService,
	}
}

// Create 创建六要素
// @Summary 创建六要素
// @Description 创建上下文工程六要素记录
// @Tags 六要素管理
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body model.ContextElementCreateRequest true "创建请求"
// @Success 200 {object} response.Response{data=model.ContextElementResponse} "创建成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "未授权"
// @Router /api/v1/context-elements [post]
func (h *ContextElementHandler) Create(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	var req model.ContextElementCreateRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	element, err := h.elementService.Create(userID, &req)
	if err != nil {
		response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		return
	}

	response.SuccessWithMessage(c, "创建成功", element)
}

// GetList 获取六要素列表
// @Summary 获取六要素列表
// @Description 获取用户的六要素记录列表
// @Tags 六要素管理
// @Produce json
// @Security BearerAuth
// @Param page query int false "页码" default(1)
// @Param size query int false "每页数量" default(15)
// @Param keyword query string false "关键词搜索"
// @Param subject query string false "主题过滤"
// @Param ai_role query string false "AI角色过滤"
// @Param my_role query string false "我的角色过滤"
// @Param sort_by query string false "排序字段" Enums(created_at, updated_at, subject)
// @Param sort_desc query bool false "是否倒序" default(true)
// @Success 200 {object} response.PageResponse{data=[]model.ContextElementResponse} "查询成功"
// @Failure 401 {object} response.Response "未授权"
// @Router /api/v1/context-elements [get]
func (h *ContextElementHandler) GetList(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	var req model.ContextElementQueryRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	elements, total, err := h.elementService.GetList(userID, &req)
	if err != nil {
		response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		return
	}

	response.PageSuccessWithMessage(c, "查询成功", elements, total, req.Page, req.Size)
}

// GetByID 获取单个六要素
// @Summary 获取单个六要素
// @Description 根据ID获取六要素记录详情
// @Tags 六要素管理
// @Produce json
// @Security BearerAuth
// @Param id path int true "六要素ID"
// @Success 200 {object} response.Response{data=model.ContextElementResponse} "获取成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "未授权"
// @Failure 404 {object} response.Response "记录不存在"
// @Router /api/v1/context-elements/{id} [get]
func (h *ContextElementHandler) GetByID(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	// 获取路径参数
	idStr := c.Param("id")
	elementID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "无效的ID参数")
		return
	}

	element, err := h.elementService.GetByID(userID, elementID)
	if err != nil {
		switch err.Error() {
		case "六要素记录不存在":
			response.Error(c, response.CodeElementNotFound)
		case "无权访问该记录":
			response.Error(c, response.CodeForbidden)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "获取成功", element)
}

// Update 更新六要素
// @Summary 更新六要素
// @Description 更新六要素记录
// @Tags 六要素管理
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param id path int true "六要素ID"
// @Param request body model.ContextElementUpdateRequest true "更新请求"
// @Success 200 {object} response.Response{data=model.ContextElementResponse} "更新成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "未授权"
// @Failure 403 {object} response.Response "无权限"
// @Failure 404 {object} response.Response "记录不存在"
// @Router /api/v1/context-elements/{id} [put]
func (h *ContextElementHandler) Update(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	// 获取路径参数
	idStr := c.Param("id")
	elementID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "无效的ID参数")
		return
	}

	var req model.ContextElementUpdateRequest
	if err := c.BindAndValidate(&req); err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "参数绑定失败: "+err.Error())
		return
	}

	element, err := h.elementService.Update(userID, elementID, &req)
	if err != nil {
		switch err.Error() {
		case "六要素记录不存在":
			response.Error(c, response.CodeElementNotFound)
		case "无权更新该记录":
			response.Error(c, response.CodeForbidden)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "更新成功", element)
}

// Delete 删除六要素
// @Summary 删除六要素
// @Description 删除六要素记录
// @Tags 六要素管理
// @Produce json
// @Security BearerAuth
// @Param id path int true "六要素ID"
// @Success 200 {object} response.Response "删除成功"
// @Failure 400 {object} response.Response "参数错误"
// @Failure 401 {object} response.Response "未授权"
// @Failure 403 {object} response.Response "无权限"
// @Failure 404 {object} response.Response "记录不存在"
// @Router /api/v1/context-elements/{id} [delete]
func (h *ContextElementHandler) Delete(ctx context.Context, c *app.RequestContext) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		response.Error(c, response.CodeUnauthorized)
		return
	}

	// 获取路径参数
	idStr := c.Param("id")
	elementID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		response.ErrorWithMessage(c, response.CodeInvalidParams, "无效的ID参数")
		return
	}

	err = h.elementService.Delete(userID, elementID)
	if err != nil {
		switch err.Error() {
		case "六要素记录不存在":
			response.Error(c, response.CodeElementNotFound)
		case "无权删除该记录":
			response.Error(c, response.CodeForbidden)
		default:
			response.ErrorWithMessage(c, response.CodeInternalError, err.Error())
		}
		return
	}

	response.SuccessWithMessage(c, "删除成功", nil)
}
