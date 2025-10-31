package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// RefreshClaims 刷新Token声明
type RefreshClaims struct {
	UserID uint64 `json:"user_id"`
	Phone  string `json:"phone"`
	Type   string `json:"type"` // "access" 或 "refresh"
	jwt.RegisteredClaims
}

// GenerateTokenPair 生成访问Token和刷新Token对
func GenerateTokenPair(userID uint64, phone, secret string, accessExpire, refreshExpire time.Duration) (accessToken, refreshToken string, err error) {
	now := time.Now()

	// 生成访问Token
	accessClaims := RefreshClaims{
		UserID: userID,
		Phone:  phone,
		Type:   "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(accessExpire)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "cese-backend",
			Subject:   "access-token",
		},
	}

	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessToken, err = accessTokenObj.SignedString([]byte(secret))
	if err != nil {
		return "", "", err
	}

	// 生成刷新Token
	refreshClaims := RefreshClaims{
		UserID: userID,
		Phone:  phone,
		Type:   "refresh",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(refreshExpire)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "cese-backend",
			Subject:   "refresh-token",
		},
	}

	refreshTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshToken, err = refreshTokenObj.SignedString([]byte(secret))
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// ParseRefreshToken 解析刷新Token
func ParseRefreshToken(tokenString, secret string) (*RefreshClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &RefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*RefreshClaims); ok && token.Valid {
		// 验证Token类型
		if claims.Type != "refresh" {
			return nil, errors.New("invalid token type")
		}
		return claims, nil
	}

	return nil, errors.New("invalid refresh token")
}

// ValidateRefreshToken 验证刷新Token是否有效
func ValidateRefreshToken(tokenString, secret string) bool {
	_, err := ParseRefreshToken(tokenString, secret)
	return err == nil
}

// RefreshAccessToken 使用刷新Token生成新的访问Token
func RefreshAccessToken(refreshToken, secret string, accessExpire time.Duration) (newAccessToken string, err error) {
	// 解析刷新Token
	claims, err := ParseRefreshToken(refreshToken, secret)
	if err != nil {
		return "", errors.New("invalid refresh token")
	}

	// 检查刷新Token是否过期
	if claims.ExpiresAt.Time.Before(time.Now()) {
		return "", errors.New("refresh token expired")
	}

	// 生成新的访问Token
	now := time.Now()
	newClaims := RefreshClaims{
		UserID: claims.UserID,
		Phone:  claims.Phone,
		Type:   "access",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(accessExpire)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "cese-backend",
			Subject:   "access-token",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, newClaims)
	return token.SignedString([]byte(secret))
}

// ExtractUserInfoFromToken 从Token中提取用户信息
func ExtractUserInfoFromToken(tokenString, secret string) (userID uint64, phone string, err error) {
	token, err := jwt.ParseWithClaims(tokenString, &RefreshClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		return 0, "", err
	}

	if claims, ok := token.Claims.(*RefreshClaims); ok && token.Valid {
		return claims.UserID, claims.Phone, nil
	}

	return 0, "", errors.New("invalid token")
}
