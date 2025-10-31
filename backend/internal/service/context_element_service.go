package service

import (
	"errors"

	"cese-backend/internal/config"
	"cese-backend/internal/model"
	"cese-backend/internal/repository"
	"cese-backend/pkg/validator"
)

// ContextElementService 六要素服务接口
type ContextElementService interface {
	Create(userID uint64, req *model.ContextElementCreateRequest) (*model.ContextElementResponse, error)
	GetByID(userID, elementID uint64) (*model.ContextElementResponse, error)
	GetList(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElementResponse, int64, error)
	Update(userID, elementID uint64, req *model.ContextElementUpdateRequest) (*model.ContextElementResponse, error)
	Delete(userID, elementID uint64) error
	Search(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElementResponse, int64, error)
}

// contextElementService 六要素服务实现
type contextElementService struct {
	elementRepo repository.ContextElementRepository
	config      *config.Config
}

// NewContextElementService 创建六要素服务实例
func NewContextElementService(elementRepo repository.ContextElementRepository, cfg *config.Config) ContextElementService {
	return &contextElementService{
		elementRepo: elementRepo,
		config:      cfg,
	}
}

// Create 创建六要素记录
func (s *contextElementService) Create(userID uint64, req *model.ContextElementCreateRequest) (*model.ContextElementResponse, error) {
	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return nil, errors.New("参数验证失败")
	}

	// 创建六要素记录
	element := req.ToContextElement(userID)
	if err := s.elementRepo.Create(element); err != nil {
		return nil, errors.New("创建六要素记录失败")
	}

	return element.ToResponse(), nil
}

// GetByID 根据ID获取六要素记录
func (s *contextElementService) GetByID(userID, elementID uint64) (*model.ContextElementResponse, error) {
	element, err := s.elementRepo.GetByID(elementID)
	if err != nil {
		return nil, errors.New("查询六要素记录失败")
	}
	if element == nil {
		return nil, errors.New("六要素记录不存在")
	}

	// 检查权限：只能访问自己的记录
	if element.UserID != userID {
		return nil, errors.New("无权访问该记录")
	}

	return element.ToResponse(), nil
}

// GetList 获取六要素列表
func (s *contextElementService) GetList(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElementResponse, int64, error) {
	// 设置默认值
	s.setDefaultQueryParams(req)

	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return nil, 0, errors.New("参数验证失败")
	}

	// 查询数据
	elements, total, err := s.elementRepo.GetByUserID(userID, req)
	if err != nil {
		return nil, 0, errors.New("查询六要素列表失败")
	}

	// 转换为响应格式
	responses := make([]*model.ContextElementResponse, len(elements))
	for i, element := range elements {
		responses[i] = element.ToResponse()
	}

	return responses, total, nil
}

// Update 更新六要素记录
func (s *contextElementService) Update(userID, elementID uint64, req *model.ContextElementUpdateRequest) (*model.ContextElementResponse, error) {
	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return nil, errors.New("参数验证失败")
	}

	// 查找记录
	element, err := s.elementRepo.GetByID(elementID)
	if err != nil {
		return nil, errors.New("查询六要素记录失败")
	}
	if element == nil {
		return nil, errors.New("六要素记录不存在")
	}

	// 检查权限：只能更新自己的记录
	if element.UserID != userID {
		return nil, errors.New("无权更新该记录")
	}

	// 更新记录
	element.UpdateFromRequest(req)
	if err := s.elementRepo.Update(element); err != nil {
		return nil, errors.New("更新六要素记录失败")
	}

	return element.ToResponse(), nil
}

// Delete 删除六要素记录
func (s *contextElementService) Delete(userID, elementID uint64) error {
	// 查找记录
	element, err := s.elementRepo.GetByID(elementID)
	if err != nil {
		return errors.New("查询六要素记录失败")
	}
	if element == nil {
		return errors.New("六要素记录不存在")
	}

	// 检查权限：只能删除自己的记录
	if element.UserID != userID {
		return errors.New("无权删除该记录")
	}

	// 删除记录
	if err := s.elementRepo.Delete(elementID); err != nil {
		return errors.New("删除六要素记录失败")
	}

	return nil
}

// Search 搜索六要素记录
func (s *contextElementService) Search(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElementResponse, int64, error) {
	// 设置默认值
	s.setDefaultQueryParams(req)

	// 参数验证
	if err := validator.ValidateStruct(req); err != nil {
		return nil, 0, errors.New("参数验证失败")
	}

	// 搜索数据
	elements, total, err := s.elementRepo.Search(userID, req)
	if err != nil {
		return nil, 0, errors.New("搜索六要素记录失败")
	}

	// 转换为响应格式
	responses := make([]*model.ContextElementResponse, len(elements))
	for i, element := range elements {
		responses[i] = element.ToResponse()
	}

	return responses, total, nil
}

// setDefaultQueryParams 设置查询参数默认值
func (s *contextElementService) setDefaultQueryParams(req *model.ContextElementQueryRequest) {
	if req.Page <= 0 {
		req.Page = s.config.Pagination.DefaultPage
	}
	if req.Size <= 0 {
		req.Size = s.config.Pagination.DefaultSize
	}
	if req.Size > s.config.Pagination.MaxSize {
		req.Size = s.config.Pagination.MaxSize
	}
	if req.SortBy == "" {
		req.SortBy = "created_at"
		req.SortDesc = true // 默认按创建时间倒序
	}
}
