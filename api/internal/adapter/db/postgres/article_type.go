package storage

import (
	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

type ArticleTypeStorage struct {
	db *gorm.DB
}

func NewArticleTypeStorage(db *gorm.DB) *ArticleTypeStorage {
	return &ArticleTypeStorage{db: db}
}

func (storage ArticleTypeStorage) List() ([]model.ArticleType, error) {
	var articleTypes []model.ArticleType
	if err := storage.db.Find(&articleTypes).Error; err != nil {
		return nil, err
	}

	return articleTypes, nil
}

func (storage ArticleTypeStorage) Get(id string) (model.ArticleType, error) {
	var articleType model.ArticleType

	if err := storage.db.Where("id = ?", id).First(&articleType).Error; err != nil {
		return model.ArticleType{}, err
	}

	return articleType, nil
}

func (storage ArticleTypeStorage) Create(articleType *model.ArticleType) error {
	if err := storage.db.Create(articleType).Error; err != nil {
		return err
	}

	return nil
}

func (storage ArticleTypeStorage) Update(articleType *model.ArticleType, values interface{}) error {
	if err := storage.db.Model(articleType).Updates(values).Error; err != nil {
		return err
	}

	return nil
}

func (storage ArticleTypeStorage) Delete(id string) error {
	if err := storage.db.Where("id = ?", id).Delete(&model.ArticleType{}).Error; err != nil {
		return err
	}

	return nil
}
