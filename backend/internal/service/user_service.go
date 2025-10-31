package service

import (
	"errors"

	"cese-backend/internal/config"
	"cese-backend/internal/model"
	"cese-backend/internal/repository"
	"cese-backend/internal/utils"
	"cese-backend/pkg/validator"
)

// UserService 用户服务接口
type UserService interface {
	Register(req *model.UserRegisterRequest) (*model.UserResponse, error)
	Login(req *model.UserLoginRequest) (*model.LoginResponse, error)
	ChangePassword(userID uint64, req *model.UserChangePasswordRequest) error
	GetProfile(userID uint64) (*model.UserResponse, error)
}

// userService 用户服务实现
type userService struct {
	userRepo repository.UserRepository
	config   *config.Config
}

// NewUserService 创建用户服务实例
func NewUserService(userRepo repository.UserRepository, cfg *config.Config) UserService {
	return &userService{
		userRepo: userRepo,
		config:   cfg,
	}
}

// Register 用户注册
func (s *userService) Register(req *model.UserRegisterRequest) (*model.UserResponse, error) {
	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return nil, errors.New("参数验证失败")
	}

	// 手机号格式验证
	if !validator.IsValidPhone(req.Phone) {
		return nil, errors.New("手机号格式错误")
	}

	// 密码强度验证
	if !validator.IsStrongPassword(req.Password) {
		return nil, errors.New("密码强度不够")
	}

	// 检查用户是否已存在
	exists, err := s.userRepo.ExistsByPhone(req.Phone)
	if err != nil {
		return nil, errors.New("检查用户存在性失败")
	}
	if exists {
		return nil, errors.New("用户已存在")
	}

	// 创建用户
	user := &model.User{
		Phone:    req.Phone,
		Password: req.Password, // 密码会在BeforeCreate钩子中加密
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, errors.New("创建用户失败")
	}

	return user.ToResponse(), nil
}

// Login 用户登录
func (s *userService) Login(req *model.UserLoginRequest) (*model.LoginResponse, error) {
	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return nil, errors.New("参数验证失败")
	}

	// 手机号格式验证
	if !validator.IsValidPhone(req.Phone) {
		return nil, errors.New("手机号格式错误")
	}

	// 查找用户
	user, err := s.userRepo.GetByPhone(req.Phone)
	if err != nil {
		return nil, errors.New("查询用户失败")
	}
	if user == nil {
		return nil, errors.New("用户不存在")
	}

	// 验证密码
	if !user.CheckPassword(req.Password) {
		return nil, errors.New("密码错误")
	}

	// 生成JWT Token
	token, err := utils.GenerateToken(
		user.ID,
		user.Phone,
		s.config.JWT.Secret,
		s.config.GetJWTExpireDuration(),
	)
	if err != nil {
		return nil, errors.New("生成Token失败")
	}

	return &model.LoginResponse{
		Token: token,
		User:  user.ToResponse(),
	}, nil
}

// ChangePassword 修改密码
func (s *userService) ChangePassword(userID uint64, req *model.UserChangePasswordRequest) error {
	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return errors.New("参数验证失败")
	}

	// 新密码强度验证
	if !validator.IsStrongPassword(req.NewPassword) {
		return errors.New("新密码强度不够")
	}

	// 查找用户
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return errors.New("查询用户失败")
	}
	if user == nil {
		return errors.New("用户不存在")
	}

	// 验证旧密码
	if !user.CheckPassword(req.OldPassword) {
		return errors.New("旧密码错误")
	}

	// 加密新密码
	hashedPassword, err := user.HashPassword(req.NewPassword)
	if err != nil {
		return errors.New("密码加密失败")
	}

	// 更新密码
	if err := s.userRepo.UpdatePassword(userID, hashedPassword); err != nil {
		return errors.New("更新密码失败")
	}

	return nil
}

// GetProfile 获取用户信息
func (s *userService) GetProfile(userID uint64) (*model.UserResponse, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, errors.New("查询用户失败")
	}
	if user == nil {
		return nil, errors.New("用户不存在")
	}

	return user.ToResponse(), nil
}
