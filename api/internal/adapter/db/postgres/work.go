package storage

import (
	"context"
	"fmt"

	"github.com/duseth/istinara/api/internal/adapter/db/postgres/helper"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type WorkStorage struct {
	db *gorm.DB
}

func NewWorkStorage(db *gorm.DB) *WorkStorage {
	return &WorkStorage{db: db}
}

func (storage WorkStorage) List(ctx context.Context) ([]model.Work, int64, error) {
	var count int64
	var works []model.Work

	hp := helper.New(storage.db.Model(&model.Work{}), ctx, model.Work{})
	db := hp.Filter("title_ru", "title_ar", "genre_ru", "genre_ar", "about_ru", "about_ar").DB

	db.Count(&count)
	db = hp.Paging().Order().DB

	if err := db.Find(&works).Error; err != nil {
		return nil, 0, err
	}

	return works, count, nil
}

func (storage WorkStorage) ListSignatures(ctx context.Context) ([]model.Work, error) {
	var works []model.Work

	db := helper.New(storage.db, ctx, model.Work{}).Order().DB

	if err := db.Select("id", "title_ru", "title_ar", "link").Find(&works).Error; err != nil {
		return nil, err
	}

	return works, nil
}

func (storage WorkStorage) ListByAuthor(ctx context.Context, authorID string) ([]model.Work, error) {
	var works []model.Work

	db := helper.New(storage.db, ctx, model.Work{}).Paging().Order().DB

	db = db.Where("author_id = ?", authorID)
	if err := db.Find(&works).Error; err != nil {
		return nil, err
	}

	return works, nil
}

func (storage WorkStorage) Get(id string) (model.Work, error) {
	var work model.Work

	column := "id"
	if _, err := uuid.FromString(id); err != nil {
		column = "link"
	}

	err := storage.db.Where(fmt.Sprint(column, " = ?"), id).Preload("Author").First(&work).Error
	if err != nil {
		return model.Work{}, err
	}

	return work, nil
}

func (storage WorkStorage) Create(work *model.Work) error {
	if err := storage.db.Create(work).Error; err != nil {
		return err
	}

	return nil
}

func (storage WorkStorage) Update(work *model.Work, values interface{}) error {
	if err := storage.db.Model(work).Updates(values).Error; err != nil {
		return err
	}

	return nil
}

func (storage WorkStorage) Delete(id string) error {
	if err := storage.db.Where("id = ?", id).Delete(&model.Work{}).Error; err != nil {
		return err
	}

	return nil
}
