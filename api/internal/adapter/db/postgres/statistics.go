package storage

import (
	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

type StatisticsStorage struct {
	db *gorm.DB
}

func NewStatisticsStorage(db *gorm.DB) *StatisticsStorage {
	return &StatisticsStorage{db: db}
}

func (storage StatisticsStorage) ListScores() (dto.ScoresDTO, error) {
	var result dto.ScoresDTO

	var err error
	err = storage.db.Model(&model.Author{}).Count(&result.AuthorsCount).Error
	err = storage.db.Model(&model.Work{}).Count(&result.WorksCount).Error
	err = storage.db.Model(&model.Article{}).Count(&result.ArticlesCount).Error

	err = storage.db.Model(&model.ArticleType{}).Count(&result.ArticleTypesCount).Error
	err = storage.db.Model(&model.Contribution{}).Count(&result.Contributions).Error

	if err != nil {
		return dto.ScoresDTO{}, err
	}

	return result, nil
}
