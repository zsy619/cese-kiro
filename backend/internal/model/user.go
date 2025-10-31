package model

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	ID        uint64         `json:"id" gorm:"primaryKey;autoIncrement;comment:用户ID"`
	Phone     string         `json:"phone" gorm:"type:varchar(11);uniqueIndex;not null;comment:手机号码"`
	Password  string         `json:"-" gorm:"type:varchar(255);not null;comment:加密密码"`
	CreatedAt time.Time      `json:"created_at" gorm:"comment:创建时间"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"comment:更新时间"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index;comment:删除时间"`

	// 关联关系
	ContextElements []ContextElement `json:"context_elements,omitempty" gorm:"foreignKey:UserID"`
}

// TableName 指定表名
func (User) TableName() string {
	return "cese_user"
}

// BeforeCreate 创建前钩子
func (u *User) BeforeCreate(tx *gorm.DB) error {
	// 密码加密
	if u.Password != "" {
		hashedPassword, err := u.HashPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = hashedPassword
	}
	return nil
}

// HashPassword 密码加密
func (u *User) HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

// CheckPassword 验证密码
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
}

// UserRegisterRequest 用户注册请求
type UserRegisterRequest struct {
	Phone    string `json:"phone" binding:"required" validate:"required,len=11,numeric"`
	Password string `json:"password" binding:"required" validate:"required,min=8,max=16"`
}

// UserLoginRequest 用户登录请求
type UserLoginRequest struct {
	Phone    string `json:"phone" binding:"required" validate:"required,len=11,numeric"`
	Password string `json:"password" binding:"required" validate:"required"`
}

// UserChangePasswordRequest 修改密码请求
type UserChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required" validate:"required"`
	NewPassword string `json:"new_password" binding:"required" validate:"required,min=8,max=16"`
}

// UserResponse 用户响应
type UserResponse struct {
	ID        uint64    `json:"id"`
	Phone     string    `json:"phone"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ToResponse 转换为响应格式
func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:        u.ID,
		Phone:     u.Phone,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

// LoginResponse 登录响应
type LoginResponse struct {
	AccessToken  string        `json:"access_token"`
	RefreshToken string        `json:"refresh_token"`
	User         *UserResponse `json:"user"`
}

// RefreshTokenRequest 刷新Token请求
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required" validate:"required"`
}

// RefreshTokenResponse 刷新Token响应
type RefreshTokenResponse struct {
	AccessToken string `json:"access_token"`
}
