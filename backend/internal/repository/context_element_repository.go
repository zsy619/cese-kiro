package repository

import (
	"errors"

	"cese-backend/internal/model"

	"gorm.io/gorm"
)

// ContextElementRepository 六要素数据访问接口
type ContextElementRepository interface {
	Create(element *model.ContextElement) error
	GetByID(id uint64) (*model.ContextElement, error)
	GetByUserID(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElement, int64, error)
	Update(element *model.ContextElement) error
	Delete(id uint64) error
	ExistsByID(id uint64) (bool, error)
	Search(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElement, int64, error)
}

// contextElementRepository 六要素数据访问实现
type contextElementRepository struct {
	db *gorm.DB
}

// NewContextElementRepository 创建六要素Repository实例
func NewContextElementRepository(db *gorm.DB) ContextElementRepository {
	return &contextElementRepository{db: db}
}

// Create 创建六要素记录
func (r *contextElementRepository) Create(element *model.ContextElement) error {
	return r.db.Create(element).Error
}

// GetByID 根据ID获取六要素记录
func (r *contextElementRepository) GetByID(id uint64) (*model.ContextElement, error) {
	var element model.ContextElement
	err := r.db.Where("id = ?", id).First(&element).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &element, nil
}

// GetByUserID 根据用户ID获取六要素列表
func (r *contextElementRepository) GetByUserID(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElement, int64, error) {
	var elements []*model.ContextElement
	var total int64

	query := r.db.Model(&model.ContextElement{}).Where("user_id = ?", userID)

	// 应用过滤条件
	query = r.applyFilters(query, req)

	// 获取总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 应用排序
	query = r.applySorting(query, req)

	// 应用分页
	offset := (req.Page - 1) * req.Size
	if err := query.Offset(offset).Limit(req.Size).Find(&elements).Error; err != nil {
		return nil, 0, err
	}

	return elements, total, nil
}

// Update 更新六要素记录
func (r *contextElementRepository) Update(element *model.ContextElement) error {
	return r.db.Save(element).Error
}

// Delete 删除六要素记录
func (r *contextElementRepository) Delete(id uint64) error {
	return r.db.Delete(&model.ContextElement{}, id).Error
}

// ExistsByID 检查六要素记录是否存在
func (r *contextElementRepository) ExistsByID(id uint64) (bool, error) {
	var count int64
	err := r.db.Model(&model.ContextElement{}).Where("id = ?", id).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// Search 搜索六要素记录
func (r *contextElementRepository) Search(userID uint64, req *model.ContextElementQueryRequest) ([]*model.ContextElement, int64, error) {
	return r.GetByUserID(userID, req)
}

// applyFilters 应用过滤条件
func (r *contextElementRepository) applyFilters(query *gorm.DB, req *model.ContextElementQueryRequest) *gorm.DB {
	// 主题过滤
	if req.Subject != "" {
		query = query.Where("subject LIKE ?", "%"+req.Subject+"%")
	}

	// AI角色过滤
	if req.AIRole != "" {
		query = query.Where("ai_role LIKE ?", "%"+req.AIRole+"%")
	}

	// 我的角色过滤
	if req.MyRole != "" {
		query = query.Where("my_role LIKE ?", "%"+req.MyRole+"%")
	}

	// 关键词搜索（全文搜索）
	if req.Keyword != "" {
		keyword := "%" + req.Keyword + "%"
		query = query.Where(
			"subject LIKE ? OR task_goal LIKE ? OR ai_role LIKE ? OR my_role LIKE ? OR key_info LIKE ? OR behavior_rule LIKE ? OR delivery_format LIKE ?",
			keyword, keyword, keyword, keyword, keyword, keyword, keyword,
		)
	}

	return query
}

// applySorting 应用排序
func (r *contextElementRepository) applySorting(query *gorm.DB, req *model.ContextElementQueryRequest) *gorm.DB {
	sortBy := req.SortBy
	if sortBy == "" {
		sortBy = "created_at"
	}

	// 验证排序字段
	validSortFields := map[string]bool{
		"created_at": true,
		"updated_at": true,
		"subject":    true,
	}

	if !validSortFields[sortBy] {
		sortBy = "created_at"
	}

	// 应用排序
	if req.SortDesc {
		query = query.Order(sortBy + " DESC")
	} else {
		query = query.Order(sortBy + " ASC")
	}

	return query
}
