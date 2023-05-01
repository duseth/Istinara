package storage

import (
	"context"
	"fmt"

	"github.com/duseth/istinara/api/internal/adapter/db/postgres/helper"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type AuthorStorage struct {
	db *gorm.DB
}

func NewAuthorStorage(db *gorm.DB) *AuthorStorage {
	return &AuthorStorage{db: db}
}

func (storage AuthorStorage) List(ctx context.Context) ([]model.Author, int64, error) {
	var count int64
	var authors []model.Author

	hp := helper.New(storage.db.Model(&model.Author{}), ctx, model.Author{})
	db := hp.Filter("name_ru", "name_ar", "short_name_ru", "short_name_ar", "about_ru", "about_ar").DB

	db.Count(&count)
	db = hp.Paging().Order().DB

	if err := db.Find(&authors).Error; err != nil {
		return nil, 0, err
	}

	return authors, count, nil
}

func (storage AuthorStorage) ListWorks(id string) ([]model.Work, error) {
	var works []model.Work
	if err := storage.db.Where("author_id = ?", id).Find(&works).Error; err != nil {
		return nil, err
	}

	return works, nil
}

func (storage AuthorStorage) ListSignatures(ctx context.Context) ([]model.Author, error) {
	var authors []model.Author

	db := helper.New(storage.db, ctx, model.Author{}).Order().DB
	if err := db.Select("id", "name_ru", "name_ar", "link").Find(&authors).Error; err != nil {
		return nil, err
	}

	return authors, nil
}

func (storage AuthorStorage) Get(id string) (model.Author, error) {
	var author model.Author

	column := "id"
	if _, err := uuid.FromString(id); err != nil {
		column = "link"
	}

	err := storage.db.Where(fmt.Sprint(column, " = ?"), id).First(&author).Error
	if err != nil {
		return model.Author{}, err
	}

	return author, nil
}

func (storage AuthorStorage) Create(author *model.Author) error {
	if err := storage.db.Create(author).Error; err != nil {
		return err
	}

	return nil
}

func (storage AuthorStorage) Update(author *model.Author, values interface{}) error {
	if err := storage.db.Model(author).Updates(values).Error; err != nil {
		return err
	}

	return nil
}

func (storage AuthorStorage) Delete(id string) error {
	if err := storage.db.Where("id = ?", id).Delete(&model.Author{}).Error; err != nil {
		return err
	}

	return nil
}
