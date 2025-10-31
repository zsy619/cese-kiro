package validator

import (
	"regexp"
	"unicode"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()

	// 注册自定义验证器
	validate.RegisterValidation("phone", validatePhone)
	validate.RegisterValidation("strong_password", validateStrongPassword)
}

// GetValidator 获取验证器实例
func GetValidator() *validator.Validate {
	return validate
}

// ValidateStruct 验证结构体
func ValidateStruct(s interface{}) error {
	return validate.Struct(s)
}

// validatePhone 验证手机号格式
func validatePhone(fl validator.FieldLevel) bool {
	phone := fl.Field().String()
	if len(phone) != 11 {
		return false
	}

	// 中国大陆手机号正则表达式
	phoneRegex := regexp.MustCompile(`^1[3-9]\d{9}$`)
	return phoneRegex.MatchString(phone)
}

// validateStrongPassword 验证密码强度
func validateStrongPassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()

	// 长度检查
	if len(password) < 8 || len(password) > 16 {
		return false
	}

	var (
		hasNumber  = false
		hasLower   = false
		hasUpper   = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	return hasNumber && hasLower && hasUpper && hasSpecial
}

// IsValidPhone 验证手机号是否有效
func IsValidPhone(phone string) bool {
	if len(phone) != 11 {
		return false
	}
	phoneRegex := regexp.MustCompile(`^1[3-9]\d{9}$`)
	return phoneRegex.MatchString(phone)
}

// IsStrongPassword 验证密码强度
func IsStrongPassword(password string) bool {
	if len(password) < 8 || len(password) > 16 {
		return false
	}

	var (
		hasNumber  = false
		hasLower   = false
		hasUpper   = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	return hasNumber && hasLower && hasUpper && hasSpecial
}

// GetPasswordStrengthErrors 获取密码强度错误信息
func GetPasswordStrengthErrors(password string) []string {
	var errors []string

	if len(password) < 8 {
		errors = append(errors, "密码长度不能少于8位")
	}
	if len(password) > 16 {
		errors = append(errors, "密码长度不能超过16位")
	}

	var (
		hasNumber  = false
		hasLower   = false
		hasUpper   = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if !hasNumber {
		errors = append(errors, "密码必须包含至少一个数字")
	}
	if !hasLower {
		errors = append(errors, "密码必须包含至少一个小写字母")
	}
	if !hasUpper {
		errors = append(errors, "密码必须包含至少一个大写字母")
	}
	if !hasSpecial {
		errors = append(errors, "密码必须包含至少一个特殊字符")
	}

	return errors
}
