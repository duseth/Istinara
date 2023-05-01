package usecase

import (
	"context"

	"github.com/duseth/istinara/api/internal/domain/model"
)

type WorkStorage interface {
	Create(work *model.Work) error
	Get(id string) (model.Work, error)
	Update(work *model.Work, values interface{}) error
	Delete(id string) error

	List(ctx context.Context) ([]model.Work, int64, error)
	ListSignatures(ctx context.Context) ([]model.Work, error)
	ListByAuthor(ctx context.Context, id string) ([]model.Work, error)
}

type WorkUsecase struct {
	storage WorkStorage
}

func NewWorkUsecase(service WorkStorage) *WorkUsecase {
	return &WorkUsecase{storage: service}
}

func (usecase WorkUsecase) List(ctx context.Context) ([]model.Work, int64, error) {
	return usecase.storage.List(ctx)
}

func (usecase WorkUsecase) ListSignatures(ctx context.Context) ([]model.Work, error) {
	return usecase.storage.ListSignatures(ctx)
}

func (usecase WorkUsecase) ListByAuthor(ctx context.Context, id string) ([]model.Work, error) {
	return usecase.storage.ListByAuthor(ctx, id)
}

func (usecase WorkUsecase) Get(id string) (model.Work, error) {
	return usecase.storage.Get(id)
}

func (usecase WorkUsecase) Create(work *model.Work) error {
	return usecase.storage.Create(work)
}

func (usecase WorkUsecase) Update(work *model.Work, values interface{}) error {
	return usecase.storage.Update(work, values)
}

func (usecase WorkUsecase) Delete(id string) error {
	return usecase.storage.Delete(id)
}
