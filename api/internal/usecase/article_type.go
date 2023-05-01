package usecase

import "github.com/duseth/istinara/api/internal/domain/model"

type ArticleTypeStorage interface {
	Create(articleType *model.ArticleType) error
	Get(id string) (model.ArticleType, error)
	Update(articleType *model.ArticleType, values interface{}) error
	Delete(id string) error

	List() ([]model.ArticleType, error)
}

type ArticleTypeUsecase struct {
	storage ArticleTypeStorage
}

func NewArticleTypeUsecase(service ArticleTypeStorage) *ArticleTypeUsecase {
	return &ArticleTypeUsecase{storage: service}
}

func (usecase ArticleTypeUsecase) List() ([]model.ArticleType, error) {
	return usecase.storage.List()
}

func (usecase ArticleTypeUsecase) Get(id string) (model.ArticleType, error) {
	return usecase.storage.Get(id)
}

func (usecase ArticleTypeUsecase) Create(articleType *model.ArticleType) error {
	return usecase.storage.Create(articleType)
}

func (usecase ArticleTypeUsecase) Update(articleType *model.ArticleType, values interface{}) error {
	return usecase.storage.Update(articleType, values)
}

func (usecase ArticleTypeUsecase) Delete(id string) error {
	return usecase.storage.Delete(id)
}
