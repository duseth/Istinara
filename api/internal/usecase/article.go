package usecase

import (
	"context"

	"github.com/duseth/istinara/api/internal/domain/model"
)

type ArticleStorage interface {
	Create(author *model.Article) error
	Get(id string) (model.Article, error)
	Update(author *model.Article, values interface{}) error
	Delete(id string) error

	List(ctx context.Context) ([]model.Article, int64, error)
	ListSignatures(ctx context.Context) ([]model.Article, error)
	ListByWork(ctx context.Context, id string) ([]model.Article, error)

	ListLinked(ctx context.Context, id string) ([]model.Article, error)
	CreateLink(link model.ArticleLink) error
	DeleteLink(articleID string, linkID string) error
}

type ArticleUsecase struct {
	articleStorage    ArticleStorage
	favouritesStorage FavouriteStorage
}

func NewArticleUsecase(articleStorage ArticleStorage, favouritesStorage FavouriteStorage) *ArticleUsecase {
	return &ArticleUsecase{articleStorage: articleStorage, favouritesStorage: favouritesStorage}
}

func (usecase ArticleUsecase) List(ctx context.Context) ([]model.Article, int64, error) {
	articles, count, err := usecase.articleStorage.List(ctx)
	if err != nil {
		return nil, 0, err
	}

	if userID := ctx.Value("user_id").(string); userID != "" {
		favourites, _ := usecase.favouritesStorage.List(userID)

		for _, favourite := range favourites {
			for i := 0; i < len(articles); i++ {
				if articles[i].ID == favourite.ArticleID {
					articles[i].IsLiked = true
				}
			}
		}
	}

	return articles, count, nil
}

func (usecase ArticleUsecase) ListSignatures(ctx context.Context) ([]model.Article, error) {
	return usecase.articleStorage.ListSignatures(ctx)
}

func (usecase ArticleUsecase) ListByWork(ctx context.Context, workID string) ([]model.Article, error) {
	articles, err := usecase.articleStorage.ListByWork(ctx, workID)
	if err != nil {
		return nil, err
	}

	if userID := ctx.Value("user_id").(string); userID != "" {
		favourites, _ := usecase.favouritesStorage.List(userID)

		for _, favourite := range favourites {
			for i := 0; i < len(articles); i++ {
				if articles[i].ID == favourite.ArticleID {
					articles[i].IsLiked = true
				}
			}
		}
	}

	return articles, nil
}

func (usecase ArticleUsecase) Get(ctx context.Context, id string) (model.Article, error) {
	article, err := usecase.articleStorage.Get(id)
	if err != nil {
		return model.Article{}, err
	}

	if userID := ctx.Value("user_id").(string); userID != "" {
		favourite, err := usecase.favouritesStorage.Get(userID, article.ID.String())
		if err == nil && favourite.ArticleID == article.ID {
			article.IsLiked = true
		}
	}

	return article, nil
}

func (usecase ArticleUsecase) Create(author *model.Article) error {
	return usecase.articleStorage.Create(author)
}

func (usecase ArticleUsecase) Update(author *model.Article, values interface{}) error {
	return usecase.articleStorage.Update(author, values)
}

func (usecase ArticleUsecase) Delete(id string) error {
	return usecase.articleStorage.Delete(id)
}

func (usecase ArticleUsecase) ListLinked(ctx context.Context, id string) ([]model.Article, error) {
	articles, err := usecase.articleStorage.ListLinked(ctx, id)
	if err != nil {
		return nil, err
	}

	if userID := ctx.Value("user_id").(string); userID != "" {
		favourites, _ := usecase.favouritesStorage.List(userID)

		for _, favourite := range favourites {
			for i := 0; i < len(articles); i++ {
				if articles[i].ID == favourite.ArticleID {
					articles[i].IsLiked = true
				}
			}
		}
	}

	return articles, nil
}

func (usecase ArticleUsecase) CreateLink(link model.ArticleLink) error {
	return usecase.articleStorage.CreateLink(link)
}

func (usecase ArticleUsecase) DeleteLink(articleID string, linkID string) error {
	return usecase.articleStorage.DeleteLink(articleID, linkID)
}
