package storage

import (
	"context"
	"fmt"

	"github.com/duseth/istinara/api/internal/adapter/db/postgres/helper"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type ArticleStorage struct {
	db *gorm.DB
}

func NewArticleStorage(db *gorm.DB) *ArticleStorage {
	return &ArticleStorage{db: db}
}

func (storage ArticleStorage) List(ctx context.Context) ([]model.Article, int64, error) {
	var count int64
	var articles []model.Article

	hp := helper.New(storage.db.Model(&model.Article{}), ctx, model.Article{})
	db := hp.Filter("title_ru", "title_ar", "quote_ru", "quote_ar", "description_ru", "description_ar").DB

	db.Count(&count)
	db = hp.Paging().Order().DB

	err := db.Preload("ArticleType").Find(&articles).Error
	if err != nil {
		return nil, 0, err
	}

	return articles, count, nil
}

func (storage ArticleStorage) ListSignatures(ctx context.Context) ([]model.Article, error) {
	var articles []model.Article

	db := helper.New(storage.db, ctx, model.Article{}).Order().DB

	err := db.Select("id", "title_ru", "title_ar", "link").Find(&articles).Error
	if err != nil {
		return nil, err
	}

	return articles, nil
}

func (storage ArticleStorage) ListLinked(ctx context.Context, id string) ([]model.Article, error) {
	var articles []model.Article

	var linkedIDs []string
	storage.db.Model(model.ArticleLink{}).Where("article_id = ?", id).Select("link_id").Find(&linkedIDs)

	if len(linkedIDs) == 0 {
		return nil, nil
	}

	db := helper.New(storage.db, ctx, model.Article{}).Order().DB
	err := db.Preload("ArticleType").Find(&articles, linkedIDs).Error
	if err != nil {
		return nil, err
	}

	return articles, nil
}

func (storage ArticleStorage) ListByWork(ctx context.Context, workID string) ([]model.Article, error) {
	var articles []model.Article

	db := helper.New(storage.db, ctx, model.Article{}).Paging().Order().DB

	db = db.Where("work_id = ?", workID)
	if err := db.Find(&articles).Error; err != nil {
		return nil, err
	}

	return articles, nil
}

func (storage ArticleStorage) Get(id string) (model.Article, error) {
	var article model.Article

	column := "id"
	if _, err := uuid.FromString(id); err != nil {
		column = "link"
	}

	db := storage.db.Where(fmt.Sprint(column, " = ?"), id)
	err := db.Preload("ArticleType").Preload("Work").Preload("Work.Author").First(&article).Error
	if err != nil {
		return model.Article{}, err
	}

	return article, nil
}

func (storage ArticleStorage) CreateLink(link model.ArticleLink) error {
	if err := storage.db.Create(&link).Error; err != nil {
		return err
	}

	return nil
}

func (storage ArticleStorage) DeleteLink(articleID string, linkID string) error {
	db := storage.db.Where("article_id = ? AND link_id = ?", articleID, linkID)
	if err := db.Delete(&model.ArticleLink{}).Error; err != nil {
		return err
	}

	return nil
}

func (storage ArticleStorage) Create(article *model.Article) error {
	if err := storage.db.Create(article).Error; err != nil {
		return err
	}

	return nil
}

func (storage ArticleStorage) Update(article *model.Article, values interface{}) error {
	if err := storage.db.Model(article).Updates(values).Error; err != nil {
		return err
	}

	return nil
}

func (storage ArticleStorage) Delete(id string) error {
	if err := storage.db.Where("id = ?", id).Delete(&model.Article{}).Error; err != nil {
		return err
	}

	return nil
}
