package model

import (
	"time"

	"gorm.io/gorm"
)

// ContextElement 上下文工程六要素模型
type ContextElement struct {
	ID             uint64         `json:"id" gorm:"primaryKey;autoIncrement;comment:六要素ID"`
	UserID         uint64         `json:"user_id" gorm:"not null;index;comment:用户ID"`
	Subject        string         `json:"subject" gorm:"type:varchar(255);not null;index;comment:主题"`
	TaskGoal       string         `json:"task_goal" gorm:"type:text;comment:任务目标"`
	AIRole         string         `json:"ai_role" gorm:"type:text;comment:AI的角色"`
	MyRole         string         `json:"my_role" gorm:"type:text;comment:我的角色"`
	KeyInfo        string         `json:"key_info" gorm:"type:text;comment:关键信息"`
	BehaviorRule   string         `json:"behavior_rule" gorm:"type:text;comment:行为规则"`
	DeliveryFormat string         `json:"delivery_format" gorm:"type:text;comment:交付格式"`
	CreatedAt      time.Time      `json:"created_at" gorm:"index;comment:创建时间"`
	UpdatedAt      time.Time      `json:"updated_at" gorm:"comment:更新时间"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index;comment:删除时间"`

	// 关联关系
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// TableName 指定表名
func (ContextElement) TableName() string {
	return "cese_context_element"
}

// ContextElementCreateRequest 创建六要素请求
type ContextElementCreateRequest struct {
	Subject        string `json:"subject" binding:"required" validate:"required,max=255"`
	TaskGoal       string `json:"task_goal" validate:"max=5000"`
	AIRole         string `json:"ai_role" validate:"max=5000"`
	MyRole         string `json:"my_role" validate:"max=5000"`
	KeyInfo        string `json:"key_info" validate:"max=5000"`
	BehaviorRule   string `json:"behavior_rule" validate:"max=5000"`
	DeliveryFormat string `json:"delivery_format" validate:"max=5000"`
}

// ContextElementUpdateRequest 更新六要素请求
type ContextElementUpdateRequest struct {
	Subject        string `json:"subject" validate:"max=255"`
	TaskGoal       string `json:"task_goal" validate:"max=5000"`
	AIRole         string `json:"ai_role" validate:"max=5000"`
	MyRole         string `json:"my_role" validate:"max=5000"`
	KeyInfo        string `json:"key_info" validate:"max=5000"`
	BehaviorRule   string `json:"behavior_rule" validate:"max=5000"`
	DeliveryFormat string `json:"delivery_format" validate:"max=5000"`
}

// ContextElementQueryRequest 查询六要素请求
type ContextElementQueryRequest struct {
	Page     int    `form:"page" validate:"min=1"`
	Size     int    `form:"size" validate:"min=1,max=100"`
	Keyword  string `form:"keyword" validate:"max=255"`
	Subject  string `form:"subject" validate:"max=255"`
	AIRole   string `form:"ai_role" validate:"max=255"`
	MyRole   string `form:"my_role" validate:"max=255"`
	SortBy   string `form:"sort_by" validate:"oneof=created_at updated_at subject"`
	SortDesc bool   `form:"sort_desc"`
}

// ContextElementResponse 六要素响应
type ContextElementResponse struct {
	ID             uint64    `json:"id"`
	UserID         uint64    `json:"user_id"`
	Subject        string    `json:"subject"`
	TaskGoal       string    `json:"task_goal"`
	AIRole         string    `json:"ai_role"`
	MyRole         string    `json:"my_role"`
	KeyInfo        string    `json:"key_info"`
	BehaviorRule   string    `json:"behavior_rule"`
	DeliveryFormat string    `json:"delivery_format"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ToResponse 转换为响应格式
func (ce *ContextElement) ToResponse() *ContextElementResponse {
	return &ContextElementResponse{
		ID:             ce.ID,
		UserID:         ce.UserID,
		Subject:        ce.Subject,
		TaskGoal:       ce.TaskGoal,
		AIRole:         ce.AIRole,
		MyRole:         ce.MyRole,
		KeyInfo:        ce.KeyInfo,
		BehaviorRule:   ce.BehaviorRule,
		DeliveryFormat: ce.DeliveryFormat,
		CreatedAt:      ce.CreatedAt,
		UpdatedAt:      ce.UpdatedAt,
	}
}

// ToContextElement 从创建请求转换为模型
func (req *ContextElementCreateRequest) ToContextElement(userID uint64) *ContextElement {
	return &ContextElement{
		UserID:         userID,
		Subject:        req.Subject,
		TaskGoal:       req.TaskGoal,
		AIRole:         req.AIRole,
		MyRole:         req.MyRole,
		KeyInfo:        req.KeyInfo,
		BehaviorRule:   req.BehaviorRule,
		DeliveryFormat: req.DeliveryFormat,
	}
}

// UpdateFromRequest 从更新请求更新模型
func (ce *ContextElement) UpdateFromRequest(req *ContextElementUpdateRequest) {
	if req.Subject != "" {
		ce.Subject = req.Subject
	}
	if req.TaskGoal != "" {
		ce.TaskGoal = req.TaskGoal
	}
	if req.AIRole != "" {
		ce.AIRole = req.AIRole
	}
	if req.MyRole != "" {
		ce.MyRole = req.MyRole
	}
	if req.KeyInfo != "" {
		ce.KeyInfo = req.KeyInfo
	}
	if req.BehaviorRule != "" {
		ce.BehaviorRule = req.BehaviorRule
	}
	if req.DeliveryFormat != "" {
		ce.DeliveryFormat = req.DeliveryFormat
	}
}
