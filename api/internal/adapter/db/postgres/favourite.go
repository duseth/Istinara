package storage

import (
	"context"

	"github.com/duseth/istinara/api/internal/adapter/db/postgres/helper"
	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

type FavouriteStorage struct {
	db *gorm.DB
}

func NewFavouriteStorage(db *gorm.DB) *FavouriteStorage {
	return &FavouriteStorage{db: db}
}

func (storage FavouriteStorage) List(userID string) ([]model.Favourite, error) {
	var favourites []model.Favourite

	if err := storage.db.Where("user_id = ?", userID).Find(&favourites).Error; err != nil {
		return nil, err
	}

	return favourites, nil
}

func (storage FavouriteStorage) ListArticles(ctx context.Context, userID string) ([]model.Article, int64, error) {
	var count int64
	var articles []model.Article

	db := storage.db.Joins("JOIN favourites ON articles.id = favourites.article_id AND favourites.user_id = ?", userID)
	db = db.Where("favourites.deleted_at IS NULL")

	db.Model(&model.Article{}).Count(&count)
	db = helper.New(db, ctx, model.Article{}).Paging().DB

	err := db.Preload("ArticleType").Order("favourites.created_at DESC").Find(&articles).Error
	if err != nil {
		return nil, 0, err
	}

	return articles, count, nil
}

func (storage FavouriteStorage) Get(userID string, articleID string) (model.Favourite, error) {
	var favourite model.Favourite

	db := storage.db.Where("user_id = ? AND article_id = ?", userID, articleID)
	if err := db.Find(&favourite).Error; err != nil {
		return model.Favourite{}, err
	}

	return favourite, nil
}

func (storage FavouriteStorage) Create(favourite model.Favourite) error {
	err := storage.db.Create(&favourite).Error
	if err != nil {
		return err
	}

	return nil
}

func (storage FavouriteStorage) Delete(userID string, articleID string) error {
	err := storage.db.Where("user_id = ? AND article_id = ?", userID, articleID).Delete(&model.Favourite{}).Error
	if err != nil {
		return err
	}

	return nil
}
