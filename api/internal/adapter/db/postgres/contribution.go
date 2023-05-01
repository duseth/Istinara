package storage

import (
	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

type ContributionStorage struct {
	db *gorm.DB
}

func NewContributionStorage(db *gorm.DB) *ContributionStorage {
	return &ContributionStorage{db: db}
}

func (storage ContributionStorage) Create(contribution model.Contribution) error {
	if err := storage.db.Create(&contribution).Error; err != nil {
		return err
	}

	return nil
}
