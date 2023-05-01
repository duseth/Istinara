package usecase

import "github.com/duseth/istinara/api/internal/controller/http/dto"

type StatisticsStorage interface {
	ListScores() (dto.ScoresDTO, error)
}

type StatisticsUsecase struct {
	storage StatisticsStorage
}

func NewStatisticsUsecase(storage StatisticsStorage) *StatisticsUsecase {
	return &StatisticsUsecase{storage: storage}
}

func (usecase StatisticsUsecase) ListScores() (dto.ScoresDTO, error) {
	return usecase.storage.ListScores()
}
