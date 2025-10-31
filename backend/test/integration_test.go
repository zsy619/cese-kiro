package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"cese-backend/internal/config"
	"cese-backend/internal/handler"
	"cese-backend/internal/model"
	"cese-backend/internal/repository"
	"cese-backend/internal/service"
	"cese-backend/pkg/response"

	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
)

// IntegrationTestSuite 集成测试套件
type IntegrationTestSuite struct {
	suite.Suite
	server *server.Hertz
	cfg    *config.Config
	token  string
	userID uint64
}

// SetupSuite 测试套件初始化
func (suite *IntegrationTestSuite) SetupSuite() {
	// 加载测试配置
	cfg := &config.Config{
		Server: config.ServerConfig{
			Host: "localhost",
			Port: 8081,
			Mode: "debug",
		},
		Database: config.DatabaseConfig{
			Host:            "localhost",
			Port:            3306,
			Username:        "root",
			Password:        "123456",
			Database:        "cese_test",
			Charset:         "utf8mb4",
			ParseTime:       true,
			Loc:             "Local",
			MaxIdleConns:    10,
			MaxOpenConns:    100,
			ConnMaxLifetime: 3600,
		},
		JWT: config.JWTConfig{
			Secret:      "test-jwt-secret-key",
			ExpireHours: 24,
		},
		Pagination: config.PaginationConfig{
			DefaultPage: 1,
			DefaultSize: 15,
			MaxSize:     100,
		},
	}
	suite.cfg = cfg

	// 初始化数据库
	err := repository.InitDatabase(cfg)
	suite.Require().NoError(err)

	// 创建Repository实例
	userRepo := repository.NewUserRepository(repository.GetDB())
	elementRepo := repository.NewContextElementRepository(repository.GetDB())

	// 创建Service实例
	userService := service.NewUserService(userRepo, cfg)
	elementService := service.NewContextElementService(elementRepo, cfg)

	// 创建Hertz服务器
	h := server.Default(server.WithHostPorts(cfg.GetServerAddr()))
	handler.SetupRoutes(h, cfg, userService, elementService)
	suite.server = h

	// 启动服务器
	go func() {
		suite.server.Spin()
	}()

	// 等待服务器启动
	time.Sleep(2 * time.Second)
}

// TearDownSuite 测试套件清理
func (suite *IntegrationTestSuite) TearDownSuite() {
	// 清理测试数据
	db := repository.GetDB()
	db.Exec("DELETE FROM cese_context_element")
	db.Exec("DELETE FROM cese_user")

	// 关闭数据库连接
	repository.CloseDatabase()
}

// TestUserRegistration 测试用户注册
func (suite *IntegrationTestSuite) TestUserRegistration() {
	// 准备请求数据
	reqData := model.UserRegisterRequest{
		Phone:    "13800138000",
		Password: "Password123!",
	}
	jsonData, _ := json.Marshal(reqData)

	// 发送注册请求
	resp, err := http.Post(
		fmt.Sprintf("http://%s/api/v1/user/register", suite.cfg.GetServerAddr()),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	// 验证响应
	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.Response
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.Equal(suite.T(), "注册成功", result.Message)
	assert.NotNil(suite.T(), result.Data)
}

// TestUserLogin 测试用户登录
func (suite *IntegrationTestSuite) TestUserLogin() {
	// 先注册用户
	suite.registerTestUser()

	// 准备登录请求数据
	reqData := model.UserLoginRequest{
		Phone:    "13800138001",
		Password: "Password123!",
	}
	jsonData, _ := json.Marshal(reqData)

	// 发送登录请求
	resp, err := http.Post(
		fmt.Sprintf("http://%s/api/v1/user/login", suite.cfg.GetServerAddr()),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	// 验证响应
	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.Response
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.Equal(suite.T(), "登录成功", result.Message)

	// 提取Token和用户ID
	loginData := result.Data.(map[string]interface{})
	suite.token = loginData["token"].(string)
	userData := loginData["user"].(map[string]interface{})
	suite.userID = uint64(userData["id"].(float64))

	assert.NotEmpty(suite.T(), suite.token)
	assert.Greater(suite.T(), suite.userID, uint64(0))
}

// TestContextElementCRUD 测试六要素CRUD操作
func (suite *IntegrationTestSuite) TestContextElementCRUD() {
	// 确保用户已登录
	if suite.token == "" {
		suite.TestUserLogin()
	}

	// 测试创建六要素
	elementID := suite.testCreateContextElement()

	// 测试获取六要素列表
	suite.testGetContextElementList()

	// 测试获取单个六要素
	suite.testGetContextElementByID(elementID)

	// 测试更新六要素
	suite.testUpdateContextElement(elementID)

	// 测试删除六要素
	suite.testDeleteContextElement(elementID)
}

// registerTestUser 注册测试用户
func (suite *IntegrationTestSuite) registerTestUser() {
	reqData := model.UserRegisterRequest{
		Phone:    "13800138001",
		Password: "Password123!",
	}
	jsonData, _ := json.Marshal(reqData)

	resp, err := http.Post(
		fmt.Sprintf("http://%s/api/v1/user/register", suite.cfg.GetServerAddr()),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	suite.Require().NoError(err)
	resp.Body.Close()
}

// testCreateContextElement 测试创建六要素
func (suite *IntegrationTestSuite) testCreateContextElement() uint64 {
	reqData := model.ContextElementCreateRequest{
		Subject:        "测试AI助手开发",
		TaskGoal:       "开发一个智能客服助手",
		AIRole:         "高级AI工程师",
		MyRole:         "产品经理",
		KeyInfo:        "需要支持多轮对话",
		BehaviorRule:   "保持专业和友好",
		DeliveryFormat: "技术方案文档",
	}
	jsonData, _ := json.Marshal(reqData)

	client := &http.Client{}
	req, _ := http.NewRequest("POST",
		fmt.Sprintf("http://%s/api/v1/context-elements", suite.cfg.GetServerAddr()),
		bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+suite.token)

	resp, err := client.Do(req)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.Response
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.Equal(suite.T(), "创建成功", result.Message)

	elementData := result.Data.(map[string]interface{})
	return uint64(elementData["id"].(float64))
}

// testGetContextElementList 测试获取六要素列表
func (suite *IntegrationTestSuite) testGetContextElementList() {
	client := &http.Client{}
	req, _ := http.NewRequest("GET",
		fmt.Sprintf("http://%s/api/v1/context-elements?page=1&size=10", suite.cfg.GetServerAddr()),
		nil)
	req.Header.Set("Authorization", "Bearer "+suite.token)

	resp, err := client.Do(req)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.PageResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.Greater(suite.T(), result.Total, int64(0))
}

// testGetContextElementByID 测试获取单个六要素
func (suite *IntegrationTestSuite) testGetContextElementByID(elementID uint64) {
	client := &http.Client{}
	req, _ := http.NewRequest("GET",
		fmt.Sprintf("http://%s/api/v1/context-elements/%d", suite.cfg.GetServerAddr(), elementID),
		nil)
	req.Header.Set("Authorization", "Bearer "+suite.token)

	resp, err := client.Do(req)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.Response
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.NotNil(suite.T(), result.Data)
}

// testUpdateContextElement 测试更新六要素
func (suite *IntegrationTestSuite) testUpdateContextElement(elementID uint64) {
	reqData := model.ContextElementUpdateRequest{
		Subject:        "更新后的AI助手开发",
		TaskGoal:       "开发一个更智能的客服助手",
		AIRole:         "资深AI工程师",
		MyRole:         "产品经理",
		KeyInfo:        "需要支持多轮对话和情感分析",
		BehaviorRule:   "保持专业、友好和同理心",
		DeliveryFormat: "详细技术方案文档",
	}
	jsonData, _ := json.Marshal(reqData)

	client := &http.Client{}
	req, _ := http.NewRequest("PUT",
		fmt.Sprintf("http://%s/api/v1/context-elements/%d", suite.cfg.GetServerAddr(), elementID),
		bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+suite.token)

	resp, err := client.Do(req)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.Response
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.Equal(suite.T(), "更新成功", result.Message)
}

// testDeleteContextElement 测试删除六要素
func (suite *IntegrationTestSuite) testDeleteContextElement(elementID uint64) {
	client := &http.Client{}
	req, _ := http.NewRequest("DELETE",
		fmt.Sprintf("http://%s/api/v1/context-elements/%d", suite.cfg.GetServerAddr(), elementID),
		nil)
	req.Header.Set("Authorization", "Bearer "+suite.token)

	resp, err := client.Do(req)
	suite.Require().NoError(err)
	defer resp.Body.Close()

	assert.Equal(suite.T(), http.StatusOK, resp.StatusCode)

	var result response.Response
	err = json.NewDecoder(resp.Body).Decode(&result)
	suite.Require().NoError(err)

	assert.Equal(suite.T(), response.CodeSuccess, result.Code)
	assert.Equal(suite.T(), "删除成功", result.Message)
}

// TestIntegrationSuite 运行集成测试套件
func TestIntegrationSuite(t *testing.T) {
	suite.Run(t, new(IntegrationTestSuite))
}
