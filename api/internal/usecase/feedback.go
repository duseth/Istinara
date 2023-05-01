package usecase

import "github.com/duseth/istinara/api/internal/domain/model"

type FeedbackStorage interface {
	Create(feedback model.Feedback) error
}

type FeedbackUsecase struct {
	storage FeedbackStorage
}

func NewFeedbackUsecase(service FeedbackStorage) *FeedbackUsecase {
	return &FeedbackUsecase{storage: service}
}

func (usecase FeedbackUsecase) Create(feedback model.Feedback) error {
	return usecase.storage.Create(feedback)
}
