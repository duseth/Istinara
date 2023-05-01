package storage

import (
	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

type FeedbackStorage struct {
	db *gorm.DB
}

func NewFeedbackStorage(db *gorm.DB) *FeedbackStorage {
	return &FeedbackStorage{db: db}
}

func (storage FeedbackStorage) Create(feedback model.Feedback) error {
	if err := storage.db.Create(&feedback).Error; err != nil {
		return err
	}

	return nil
}
