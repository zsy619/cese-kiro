package test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"testing"
	"time"

	"cese-backend/internal/model"
)

// BenchmarkConfig 压力测试配置
type BenchmarkConfig struct {
	BaseURL     string
	Concurrency int
	Duration    time.Duration
	Token       string
}

// BenchmarkResult 压力测试结果
type BenchmarkResult struct {
	TotalRequests     int64
	SuccessRequests   int64
	FailedRequests    int64
	AverageLatency    time.Duration
	MaxLatency        time.Duration
	MinLatency        time.Duration
	RequestsPerSecond float64
}

// BenchmarkUserLogin 用户登录压力测试
func BenchmarkUserLogin(b *testing.B) {
	config := BenchmarkConfig{
		BaseURL:     "http://localhost:8080",
		Concurrency: 100,
		Duration:    30 * time.Second,
	}

	// 准备登录数据
	loginData := model.UserLoginRequest{
		Phone:    "13800138000",
		Password: "Password123!",
	}
	jsonData, _ := json.Marshal(loginData)

	b.ResetTimer()
	b.RunParallel(func(pb *testing.PB) {
		client := &http.Client{
			Timeout: 10 * time.Second,
		}

		for pb.Next() {
			resp, err := client.Post(
				config.BaseURL+"/api/v1/user/login",
				"application/json",
				bytes.NewBuffer(jsonData),
			)
			if err != nil {
				b.Error(err)
				continue
			}
			resp.Body.Close()
		}
	})
}

// BenchmarkContextElementCreate 六要素创建压力测试
func BenchmarkContextElementCreate(b *testing.B) {
	config := BenchmarkConfig{
		BaseURL: "http://localhost:8080",
		Token:   "your-test-token", // 需要先获取有效Token
	}

	// 准备创建数据
	createData := model.ContextElementCreateRequest{
		Subject:        "压力测试AI助手开发",
		TaskGoal:       "开发一个智能客服助手",
		AIRole:         "高级AI工程师",
		MyRole:         "产品经理",
		KeyInfo:        "需要支持多轮对话",
		BehaviorRule:   "保持专业和友好",
		DeliveryFormat: "技术方案文档",
	}
	jsonData, _ := json.Marshal(createData)

	b.ResetTimer()
	b.RunParallel(func(pb *testing.PB) {
		client := &http.Client{
			Timeout: 10 * time.Second,
		}

		for pb.Next() {
			req, _ := http.NewRequest("POST",
				config.BaseURL+"/api/v1/context-elements",
				bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+config.Token)

			resp, err := client.Do(req)
			if err != nil {
				b.Error(err)
				continue
			}
			resp.Body.Close()
		}
	})
}

// LoadTest 负载测试
func LoadTest(config BenchmarkConfig, endpoint string, method string, data []byte, headers map[string]string) *BenchmarkResult {
	var (
		totalRequests   int64
		successRequests int64
		failedRequests  int64
		totalLatency    time.Duration
		maxLatency      time.Duration
		minLatency      = time.Hour // 初始化为一个很大的值
		mutex           sync.Mutex
	)

	startTime := time.Now()
	endTime := startTime.Add(config.Duration)

	// 创建工作协程
	var wg sync.WaitGroup
	for i := 0; i < config.Concurrency; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			client := &http.Client{
				Timeout: 10 * time.Second,
			}

			for time.Now().Before(endTime) {
				requestStart := time.Now()

				// 创建请求
				var req *http.Request
				var err error
				if data != nil {
					req, err = http.NewRequest(method, config.BaseURL+endpoint, bytes.NewBuffer(data))
				} else {
					req, err = http.NewRequest(method, config.BaseURL+endpoint, nil)
				}

				if err != nil {
					mutex.Lock()
					failedRequests++
					totalRequests++
					mutex.Unlock()
					continue
				}

				// 设置请求头
				for key, value := range headers {
					req.Header.Set(key, value)
				}

				// 发送请求
				resp, err := client.Do(req)
				latency := time.Since(requestStart)

				mutex.Lock()
				totalRequests++
				totalLatency += latency

				if latency > maxLatency {
					maxLatency = latency
				}
				if latency < minLatency {
					minLatency = latency
				}

				if err != nil || resp.StatusCode >= 400 {
					failedRequests++
				} else {
					successRequests++
				}
				mutex.Unlock()

				if resp != nil {
					resp.Body.Close()
				}
			}
		}()
	}

	wg.Wait()

	// 计算结果
	duration := time.Since(startTime)
	averageLatency := time.Duration(0)
	if totalRequests > 0 {
		averageLatency = totalLatency / time.Duration(totalRequests)
	}

	requestsPerSecond := float64(totalRequests) / duration.Seconds()

	return &BenchmarkResult{
		TotalRequests:     totalRequests,
		SuccessRequests:   successRequests,
		FailedRequests:    failedRequests,
		AverageLatency:    averageLatency,
		MaxLatency:        maxLatency,
		MinLatency:        minLatency,
		RequestsPerSecond: requestsPerSecond,
	}
}

// TestLoadTestUserLogin 用户登录负载测试
func TestLoadTestUserLogin(t *testing.T) {
	config := BenchmarkConfig{
		BaseURL:     "http://localhost:8080",
		Concurrency: 50,
		Duration:    10 * time.Second,
	}

	loginData := model.UserLoginRequest{
		Phone:    "13800138000",
		Password: "Password123!",
	}
	jsonData, _ := json.Marshal(loginData)

	headers := map[string]string{
		"Content-Type": "application/json",
	}

	result := LoadTest(config, "/api/v1/user/login", "POST", jsonData, headers)

	// 输出测试结果
	t.Logf("=== 用户登录负载测试结果 ===")
	t.Logf("总请求数: %d", result.TotalRequests)
	t.Logf("成功请求数: %d", result.SuccessRequests)
	t.Logf("失败请求数: %d", result.FailedRequests)
	t.Logf("成功率: %.2f%%", float64(result.SuccessRequests)/float64(result.TotalRequests)*100)
	t.Logf("平均延迟: %v", result.AverageLatency)
	t.Logf("最大延迟: %v", result.MaxLatency)
	t.Logf("最小延迟: %v", result.MinLatency)
	t.Logf("每秒请求数: %.2f", result.RequestsPerSecond)

	// 断言性能指标
	if result.RequestsPerSecond < 100 {
		t.Errorf("每秒请求数过低: %.2f < 100", result.RequestsPerSecond)
	}
	if result.AverageLatency > 100*time.Millisecond {
		t.Errorf("平均延迟过高: %v > 100ms", result.AverageLatency)
	}
	if float64(result.SuccessRequests)/float64(result.TotalRequests) < 0.95 {
		t.Errorf("成功率过低: %.2f%% < 95%%", float64(result.SuccessRequests)/float64(result.TotalRequests)*100)
	}
}

// TestLoadTestContextElementList 六要素列表查询负载测试
func TestLoadTestContextElementList(t *testing.T) {
	config := BenchmarkConfig{
		BaseURL:     "http://localhost:8080",
		Concurrency: 100,
		Duration:    10 * time.Second,
		Token:       "your-test-token", // 需要先获取有效Token
	}

	headers := map[string]string{
		"Authorization": "Bearer " + config.Token,
	}

	result := LoadTest(config, "/api/v1/context-elements?page=1&size=10", "GET", nil, headers)

	// 输出测试结果
	t.Logf("=== 六要素列表查询负载测试结果 ===")
	t.Logf("总请求数: %d", result.TotalRequests)
	t.Logf("成功请求数: %d", result.SuccessRequests)
	t.Logf("失败请求数: %d", result.FailedRequests)
	t.Logf("成功率: %.2f%%", float64(result.SuccessRequests)/float64(result.TotalRequests)*100)
	t.Logf("平均延迟: %v", result.AverageLatency)
	t.Logf("最大延迟: %v", result.MaxLatency)
	t.Logf("最小延迟: %v", result.MinLatency)
	t.Logf("每秒请求数: %.2f", result.RequestsPerSecond)

	// 断言性能指标
	if result.RequestsPerSecond < 200 {
		t.Errorf("每秒请求数过低: %.2f < 200", result.RequestsPerSecond)
	}
	if result.AverageLatency > 50*time.Millisecond {
		t.Errorf("平均延迟过高: %v > 50ms", result.AverageLatency)
	}
}

// ConcurrencyTest 并发测试
func ConcurrencyTest(t *testing.T, endpoint string, concurrency int, iterations int) {
	var wg sync.WaitGroup
	errors := make(chan error, concurrency*iterations)

	for i := 0; i < concurrency; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			client := &http.Client{
				Timeout: 10 * time.Second,
			}

			for j := 0; j < iterations; j++ {
				resp, err := client.Get(fmt.Sprintf("http://localhost:8080%s", endpoint))
				if err != nil {
					errors <- fmt.Errorf("Worker %d, Iteration %d: %v", workerID, j, err)
					continue
				}
				resp.Body.Close()

				if resp.StatusCode >= 400 {
					errors <- fmt.Errorf("Worker %d, Iteration %d: HTTP %d", workerID, j, resp.StatusCode)
				}
			}
		}(i)
	}

	wg.Wait()
	close(errors)

	// 统计错误
	errorCount := 0
	for err := range errors {
		t.Log(err)
		errorCount++
	}

	totalRequests := concurrency * iterations
	successRate := float64(totalRequests-errorCount) / float64(totalRequests) * 100

	t.Logf("=== 并发测试结果 ===")
	t.Logf("并发数: %d", concurrency)
	t.Logf("每个协程请求数: %d", iterations)
	t.Logf("总请求数: %d", totalRequests)
	t.Logf("错误数: %d", errorCount)
	t.Logf("成功率: %.2f%%", successRate)

	if successRate < 95.0 {
		t.Errorf("并发测试成功率过低: %.2f%% < 95%%", successRate)
	}
}

// TestConcurrencyHealthCheck 健康检查并发测试
func TestConcurrencyHealthCheck(t *testing.T) {
	ConcurrencyTest(t, "/health", 50, 20)
}
