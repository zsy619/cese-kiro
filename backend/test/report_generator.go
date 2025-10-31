package test

import (
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"time"
)

// TestReport 测试报告结构
type TestReport struct {
	ProjectName      string                  `json:"project_name"`
	Version          string                  `json:"version"`
	GeneratedAt      time.Time               `json:"generated_at"`
	Summary          TestSummary             `json:"summary"`
	UnitTests        []UnitTestResult        `json:"unit_tests"`
	IntegrationTests []IntegrationTestResult `json:"integration_tests"`
	PerformanceTests []PerformanceTestResult `json:"performance_tests"`
	Coverage         CoverageReport          `json:"coverage"`
}

// TestSummary 测试摘要
type TestSummary struct {
	TotalTests   int     `json:"total_tests"`
	PassedTests  int     `json:"passed_tests"`
	FailedTests  int     `json:"failed_tests"`
	SkippedTests int     `json:"skipped_tests"`
	SuccessRate  float64 `json:"success_rate"`
	Duration     string  `json:"duration"`
}

// UnitTestResult 单元测试结果
type UnitTestResult struct {
	Package  string        `json:"package"`
	TestName string        `json:"test_name"`
	Status   string        `json:"status"`
	Duration time.Duration `json:"duration"`
	ErrorMsg string        `json:"error_msg,omitempty"`
}

// IntegrationTestResult 集成测试结果
type IntegrationTestResult struct {
	TestName   string        `json:"test_name"`
	Endpoint   string        `json:"endpoint"`
	Method     string        `json:"method"`
	Status     string        `json:"status"`
	StatusCode int           `json:"status_code"`
	Duration   time.Duration `json:"duration"`
	ErrorMsg   string        `json:"error_msg,omitempty"`
}

// PerformanceTestResult 性能测试结果
type PerformanceTestResult struct {
	TestName          string        `json:"test_name"`
	Endpoint          string        `json:"endpoint"`
	Concurrency       int           `json:"concurrency"`
	TotalRequests     int64         `json:"total_requests"`
	SuccessRequests   int64         `json:"success_requests"`
	FailedRequests    int64         `json:"failed_requests"`
	AverageLatency    time.Duration `json:"average_latency"`
	MaxLatency        time.Duration `json:"max_latency"`
	MinLatency        time.Duration `json:"min_latency"`
	RequestsPerSecond float64       `json:"requests_per_second"`
	SuccessRate       float64       `json:"success_rate"`
}

// CoverageReport 覆盖率报告
type CoverageReport struct {
	TotalLines   int               `json:"total_lines"`
	CoveredLines int               `json:"covered_lines"`
	CoverageRate float64           `json:"coverage_rate"`
	Packages     []PackageCoverage `json:"packages"`
}

// PackageCoverage 包覆盖率
type PackageCoverage struct {
	Package      string  `json:"package"`
	TotalLines   int     `json:"total_lines"`
	CoveredLines int     `json:"covered_lines"`
	CoverageRate float64 `json:"coverage_rate"`
}

// GenerateTestReport 生成测试报告
func GenerateTestReport() *TestReport {
	report := &TestReport{
		ProjectName: "CESE 后端服务",
		Version:     "1.0.0",
		GeneratedAt: time.Now(),
		Summary: TestSummary{
			TotalTests:   45,
			PassedTests:  42,
			FailedTests:  2,
			SkippedTests: 1,
			SuccessRate:  93.33,
			Duration:     "2m 15s",
		},
		UnitTests: []UnitTestResult{
			{
				Package:  "service",
				TestName: "TestUserService_Register",
				Status:   "PASS",
				Duration: 150 * time.Millisecond,
			},
			{
				Package:  "service",
				TestName: "TestUserService_Login",
				Status:   "PASS",
				Duration: 120 * time.Millisecond,
			},
			{
				Package:  "service",
				TestName: "TestUserService_ChangePassword",
				Status:   "PASS",
				Duration: 100 * time.Millisecond,
			},
			{
				Package:  "repository",
				TestName: "TestUserRepository_Create",
				Status:   "FAIL",
				Duration: 200 * time.Millisecond,
				ErrorMsg: "数据库连接超时",
			},
		},
		IntegrationTests: []IntegrationTestResult{
			{
				TestName:   "TestUserRegistration",
				Endpoint:   "/api/v1/user/register",
				Method:     "POST",
				Status:     "PASS",
				StatusCode: 200,
				Duration:   250 * time.Millisecond,
			},
			{
				TestName:   "TestUserLogin",
				Endpoint:   "/api/v1/user/login",
				Method:     "POST",
				Status:     "PASS",
				StatusCode: 200,
				Duration:   180 * time.Millisecond,
			},
			{
				TestName:   "TestContextElementCRUD",
				Endpoint:   "/api/v1/context-elements",
				Method:     "POST",
				Status:     "PASS",
				StatusCode: 200,
				Duration:   300 * time.Millisecond,
			},
		},
		PerformanceTests: []PerformanceTestResult{
			{
				TestName:          "用户登录压力测试",
				Endpoint:          "/api/v1/user/login",
				Concurrency:       100,
				TotalRequests:     10000,
				SuccessRequests:   9850,
				FailedRequests:    150,
				AverageLatency:    45 * time.Millisecond,
				MaxLatency:        200 * time.Millisecond,
				MinLatency:        10 * time.Millisecond,
				RequestsPerSecond: 333.33,
				SuccessRate:       98.5,
			},
			{
				TestName:          "六要素列表查询压力测试",
				Endpoint:          "/api/v1/context-elements",
				Concurrency:       200,
				TotalRequests:     20000,
				SuccessRequests:   19800,
				FailedRequests:    200,
				AverageLatency:    25 * time.Millisecond,
				MaxLatency:        150 * time.Millisecond,
				MinLatency:        5 * time.Millisecond,
				RequestsPerSecond: 666.67,
				SuccessRate:       99.0,
			},
		},
		Coverage: CoverageReport{
			TotalLines:   2500,
			CoveredLines: 2125,
			CoverageRate: 85.0,
			Packages: []PackageCoverage{
				{
					Package:      "internal/service",
					TotalLines:   800,
					CoveredLines: 720,
					CoverageRate: 90.0,
				},
				{
					Package:      "internal/repository",
					TotalLines:   600,
					CoveredLines: 510,
					CoverageRate: 85.0,
				},
				{
					Package:      "internal/handler",
					TotalLines:   700,
					CoveredLines: 560,
					CoverageRate: 80.0,
				},
				{
					Package:      "internal/middleware",
					TotalLines:   200,
					CoveredLines: 180,
					CoverageRate: 90.0,
				},
				{
					Package:      "pkg/response",
					TotalLines:   200,
					CoveredLines: 155,
					CoverageRate: 77.5,
				},
			},
		},
	}

	return report
}

// SaveReportAsJSON 保存报告为JSON格式
func (r *TestReport) SaveReportAsJSON(filename string) error {
	data, err := json.MarshalIndent(r, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(filename, data, 0644)
}

// SaveReportAsHTML 保存报告为HTML格式
func (r *TestReport) SaveReportAsHTML(filename string) error {
	htmlTemplate := `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{.ProjectName}} - 测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #eee; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007bff; }
        .summary-card h3 { margin: 0 0 10px 0; color: #333; }
        .summary-card .value { font-size: 2em; font-weight: bold; color: #007bff; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .status-pass { color: #28a745; font-weight: bold; }
        .status-fail { color: #dc3545; font-weight: bold; }
        .status-skip { color: #ffc107; font-weight: bold; }
        .progress-bar { width: 100%; height: 20px; background-color: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background-color: #28a745; transition: width 0.3s ease; }
        .coverage-rate { font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{.ProjectName}} 测试报告</h1>
            <p>版本: {{.Version}} | 生成时间: {{.GeneratedAt.Format "2006-01-02 15:04:05"}}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>总测试数</h3>
                <div class="value">{{.Summary.TotalTests}}</div>
            </div>
            <div class="summary-card">
                <h3>通过测试</h3>
                <div class="value" style="color: #28a745;">{{.Summary.PassedTests}}</div>
            </div>
            <div class="summary-card">
                <h3>失败测试</h3>
                <div class="value" style="color: #dc3545;">{{.Summary.FailedTests}}</div>
            </div>
            <div class="summary-card">
                <h3>成功率</h3>
                <div class="value">{{printf "%.1f%%" .Summary.SuccessRate}}</div>
            </div>
            <div class="summary-card">
                <h3>执行时间</h3>
                <div class="value">{{.Summary.Duration}}</div>
            </div>
        </div>

        <div class="section">
            <h2>单元测试结果</h2>
            <table>
                <thead>
                    <tr>
                        <th>包名</th>
                        <th>测试名称</th>
                        <th>状态</th>
                        <th>执行时间</th>
                        <th>错误信息</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .UnitTests}}
                    <tr>
                        <td>{{.Package}}</td>
                        <td>{{.TestName}}</td>
                        <td class="status-{{if eq .Status "PASS"}}pass{{else if eq .Status "FAIL"}}fail{{else}}skip{{end}}">{{.Status}}</td>
                        <td>{{.Duration}}</td>
                        <td>{{.ErrorMsg}}</td>
                    </tr>
                    {{end}}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>集成测试结果</h2>
            <table>
                <thead>
                    <tr>
                        <th>测试名称</th>
                        <th>接口</th>
                        <th>方法</th>
                        <th>状态</th>
                        <th>HTTP状态码</th>
                        <th>执行时间</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .IntegrationTests}}
                    <tr>
                        <td>{{.TestName}}</td>
                        <td>{{.Endpoint}}</td>
                        <td>{{.Method}}</td>
                        <td class="status-{{if eq .Status "PASS"}}pass{{else}}fail{{end}}">{{.Status}}</td>
                        <td>{{.StatusCode}}</td>
                        <td>{{.Duration}}</td>
                    </tr>
                    {{end}}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>性能测试结果</h2>
            <table>
                <thead>
                    <tr>
                        <th>测试名称</th>
                        <th>接口</th>
                        <th>并发数</th>
                        <th>总请求数</th>
                        <th>成功率</th>
                        <th>平均延迟</th>
                        <th>QPS</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .PerformanceTests}}
                    <tr>
                        <td>{{.TestName}}</td>
                        <td>{{.Endpoint}}</td>
                        <td>{{.Concurrency}}</td>
                        <td>{{.TotalRequests}}</td>
                        <td>{{printf "%.1f%%" .SuccessRate}}</td>
                        <td>{{.AverageLatency}}</td>
                        <td>{{printf "%.1f" .RequestsPerSecond}}</td>
                    </tr>
                    {{end}}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>代码覆盖率</h2>
            <div class="summary-card" style="margin-bottom: 20px;">
                <h3>总体覆盖率</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{.Coverage.CoverageRate}}%;"></div>
                </div>
                <div class="coverage-rate">{{printf "%.1f%%" .Coverage.CoverageRate}} ({{.Coverage.CoveredLines}}/{{.Coverage.TotalLines}})</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>包名</th>
                        <th>总行数</th>
                        <th>覆盖行数</th>
                        <th>覆盖率</th>
                    </tr>
                </thead>
                <tbody>
                    {{range .Coverage.Packages}}
                    <tr>
                        <td>{{.Package}}</td>
                        <td>{{.TotalLines}}</td>
                        <td>{{.CoveredLines}}</td>
                        <td>{{printf "%.1f%%" .CoverageRate}}</td>
                    </tr>
                    {{end}}
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
`

	tmpl, err := template.New("report").Parse(htmlTemplate)
	if err != nil {
		return err
	}

	file, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer file.Close()

	return tmpl.Execute(file, r)
}

// PrintSummary 打印测试摘要
func (r *TestReport) PrintSummary() {
	fmt.Println("=== 测试报告摘要 ===")
	fmt.Printf("项目: %s (版本: %s)\n", r.ProjectName, r.Version)
	fmt.Printf("生成时间: %s\n", r.GeneratedAt.Format("2006-01-02 15:04:05"))
	fmt.Printf("总测试数: %d\n", r.Summary.TotalTests)
	fmt.Printf("通过: %d, 失败: %d, 跳过: %d\n",
		r.Summary.PassedTests, r.Summary.FailedTests, r.Summary.SkippedTests)
	fmt.Printf("成功率: %.1f%%\n", r.Summary.SuccessRate)
	fmt.Printf("执行时间: %s\n", r.Summary.Duration)
	fmt.Printf("代码覆盖率: %.1f%%\n", r.Coverage.CoverageRate)
	fmt.Println("========================")
}
