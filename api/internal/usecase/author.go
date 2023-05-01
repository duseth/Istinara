package usecase

import (
	"context"

	"github.com/duseth/istinara/api/internal/domain/model"
)

type AuthorStorage interface {
	Create(author *model.Author) error
	Get(id string) (model.Author, error)
	Update(author *model.Author, values interface{}) error
	Delete(id string) error

	List(ctx context.Context) ([]model.Author, int64, error)
	ListSignatures(ctx context.Context) ([]model.Author, error)
	ListWorks(workID string) ([]model.Work, error)
}

type AuthorUsecase struct {
	storage AuthorStorage
}

func NewAuthorUsecase(service AuthorStorage) *AuthorUsecase {
	return &AuthorUsecase{storage: service}
}

func (usecase AuthorUsecase) List(ctx context.Context) ([]model.Author, int64, error) {
	return usecase.storage.List(ctx)
}

func (usecase AuthorUsecase) ListWorks(workID string) ([]model.Work, error) {
	return usecase.storage.ListWorks(workID)
}

func (usecase AuthorUsecase) ListSignatures(ctx context.Context) ([]model.Author, error) {
	return usecase.storage.ListSignatures(ctx)
}

func (usecase AuthorUsecase) Get(id string) (model.Author, error) {
	return usecase.storage.Get(id)
}

func (usecase AuthorUsecase) Create(author *model.Author) error {
	return usecase.storage.Create(author)
}

func (usecase AuthorUsecase) Update(author *model.Author, values interface{}) error {
	return usecase.storage.Update(author, values)
}

func (usecase AuthorUsecase) Delete(id string) error {
	return usecase.storage.Delete(id)
}
