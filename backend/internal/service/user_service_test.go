package service

import (
	"errors"
	"testing"
	"time"

	"cese-backend/internal/config"
	"cese-backend/internal/model"
	"cese-backend/internal/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockUserRepository 用户Repository模拟
type MockUserRepository struct {
	mock.Mock
}

func (m *MockUserRepository) Create(user *model.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *MockUserRepository) GetByPhone(phone string) (*model.User, error) {
	args := m.Called(phone)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func (m *MockUserRepository) GetByID(id uint64) (*model.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*model.User), args.Error(1)
}

func (m *MockUserRepository) UpdatePassword(id uint64, hashedPassword string) error {
	args := m.Called(id, hashedPassword)
	return args.Error(0)
}

func (m *MockUserRepository) ExistsByPhone(phone string) (bool, error) {
	args := m.Called(phone)
	return args.Bool(0), args.Error(1)
}

func TestUserService_Register(t *testing.T) {
	mockRepo := new(MockUserRepository)
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:      "test-secret",
			ExpireHours: 24,
		},
	}
	service := NewUserService(mockRepo, cfg)

	tests := []struct {
		name    string
		req     *model.UserRegisterRequest
		setup   func()
		wantErr bool
		errMsg  string
	}{
		{
			name: "成功注册",
			req: &model.UserRegisterRequest{
				Phone:    "13800138000",
				Password: "Password123!",
			},
			setup: func() {
				mockRepo.On("ExistsByPhone", "13800138000").Return(false, nil)
				mockRepo.On("Create", mock.AnythingOfType("*model.User")).Return(nil)
			},
			wantErr: false,
		},
		{
			name: "手机号格式错误",
			req: &model.UserRegisterRequest{
				Phone:    "1380013800",
				Password: "Password123!",
			},
			setup:   func() {},
			wantErr: true,
			errMsg:  "手机号格式错误",
		},
		{
			name: "密码强度不够",
			req: &model.UserRegisterRequest{
				Phone:    "13800138000",
				Password: "123456",
			},
			setup:   func() {},
			wantErr: true,
			errMsg:  "密码强度不够",
		},
		{
			name: "用户已存在",
			req: &model.UserRegisterRequest{
				Phone:    "13800138000",
				Password: "Password123!",
			},
			setup: func() {
				mockRepo.On("ExistsByPhone", "13800138000").Return(true, nil)
			},
			wantErr: true,
			errMsg:  "用户已存在",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil
			tt.setup()

			user, err := service.Register(tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errMsg)
				assert.Nil(t, user)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.Equal(t, tt.req.Phone, user.Phone)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserService_Login(t *testing.T) {
	mockRepo := new(MockUserRepository)
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:      "test-secret",
			ExpireHours: 24,
		},
	}
	service := NewUserService(mockRepo, cfg)

	// 创建测试用户
	testUser := &model.User{
		ID:    1,
		Phone: "13800138000",
	}
	testUser.Password, _ = testUser.HashPassword("Password123!")

	tests := []struct {
		name    string
		req     *model.UserLoginRequest
		setup   func()
		wantErr bool
		errMsg  string
	}{
		{
			name: "成功登录",
			req: &model.UserLoginRequest{
				Phone:    "13800138000",
				Password: "Password123!",
			},
			setup: func() {
				mockRepo.On("GetByPhone", "13800138000").Return(testUser, nil)
			},
			wantErr: false,
		},
		{
			name: "用户不存在",
			req: &model.UserLoginRequest{
				Phone:    "13800138001",
				Password: "Password123!",
			},
			setup: func() {
				mockRepo.On("GetByPhone", "13800138001").Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "用户不存在",
		},
		{
			name: "密码错误",
			req: &model.UserLoginRequest{
				Phone:    "13800138000",
				Password: "WrongPassword123!",
			},
			setup: func() {
				mockRepo.On("GetByPhone", "13800138000").Return(testUser, nil)
			},
			wantErr: true,
			errMsg:  "密码错误",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil
			tt.setup()

			loginResp, err := service.Login(tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errMsg)
				assert.Nil(t, loginResp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, loginResp)
				assert.NotEmpty(t, loginResp.AccessToken)
				assert.Equal(t, testUser.ID, loginResp.User.ID)
				assert.Equal(t, testUser.Phone, loginResp.User.Phone)

				// 验证Token是否有效
				claims, err := utils.ParseToken(loginResp.AccessToken, cfg.JWT.Secret)
				assert.NoError(t, err)
				assert.Equal(t, testUser.ID, claims.UserID)
				assert.Equal(t, testUser.Phone, claims.Phone)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserService_ChangePassword(t *testing.T) {
	mockRepo := new(MockUserRepository)
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:      "test-secret",
			ExpireHours: 24,
		},
	}
	service := NewUserService(mockRepo, cfg)

	// 创建测试用户
	testUser := &model.User{
		ID:    1,
		Phone: "13800138000",
	}
	testUser.Password, _ = testUser.HashPassword("OldPassword123!")

	tests := []struct {
		name    string
		userID  uint64
		req     *model.UserChangePasswordRequest
		setup   func()
		wantErr bool
		errMsg  string
	}{
		{
			name:   "成功修改密码",
			userID: 1,
			req: &model.UserChangePasswordRequest{
				OldPassword: "OldPassword123!",
				NewPassword: "NewPassword123!",
			},
			setup: func() {
				mockRepo.On("GetByID", uint64(1)).Return(testUser, nil)
				mockRepo.On("UpdatePassword", uint64(1), mock.AnythingOfType("string")).Return(nil)
			},
			wantErr: false,
		},
		{
			name:   "用户不存在",
			userID: 999,
			req: &model.UserChangePasswordRequest{
				OldPassword: "OldPassword123!",
				NewPassword: "NewPassword123!",
			},
			setup: func() {
				mockRepo.On("GetByID", uint64(999)).Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "用户不存在",
		},
		{
			name:   "旧密码错误",
			userID: 1,
			req: &model.UserChangePasswordRequest{
				OldPassword: "WrongPassword123!",
				NewPassword: "NewPassword123!",
			},
			setup: func() {
				mockRepo.On("GetByID", uint64(1)).Return(testUser, nil)
			},
			wantErr: true,
			errMsg:  "旧密码错误",
		},
		{
			name:   "新密码强度不够",
			userID: 1,
			req: &model.UserChangePasswordRequest{
				OldPassword: "OldPassword123!",
				NewPassword: "123456",
			},
			setup: func() {
				mockRepo.On("GetByID", uint64(1)).Return(testUser, nil)
			},
			wantErr: true,
			errMsg:  "新密码强度不够",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil
			tt.setup()

			err := service.ChangePassword(tt.userID, tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errMsg)
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUserService_GetProfile(t *testing.T) {
	mockRepo := new(MockUserRepository)
	cfg := &config.Config{}
	service := NewUserService(mockRepo, cfg)

	testUser := &model.User{
		ID:        1,
		Phone:     "13800138000",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	tests := []struct {
		name    string
		userID  uint64
		setup   func()
		wantErr bool
		errMsg  string
	}{
		{
			name:   "成功获取用户信息",
			userID: 1,
			setup: func() {
				mockRepo.On("GetByID", uint64(1)).Return(testUser, nil)
			},
			wantErr: false,
		},
		{
			name:   "用户不存在",
			userID: 999,
			setup: func() {
				mockRepo.On("GetByID", uint64(999)).Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "用户不存在",
		},
		{
			name:   "数据库错误",
			userID: 1,
			setup: func() {
				mockRepo.On("GetByID", uint64(1)).Return(nil, errors.New("database error"))
			},
			wantErr: true,
			errMsg:  "查询用户失败",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo.ExpectedCalls = nil
			tt.setup()

			user, err := service.GetProfile(tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Contains(t, err.Error(), tt.errMsg)
				assert.Nil(t, user)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.Equal(t, testUser.ID, user.ID)
				assert.Equal(t, testUser.Phone, user.Phone)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
