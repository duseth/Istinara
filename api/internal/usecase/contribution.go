package usecase

import "github.com/duseth/istinara/api/internal/domain/model"

type ContributionStorage interface {
	Create(contribution model.Contribution) error
}

type ContributionUsecase struct {
	storage ContributionStorage
}

func NewContributionUsecase(service ContributionStorage) *ContributionUsecase {
	return &ContributionUsecase{storage: service}
}

func (usecase ContributionUsecase) Create(contribution model.Contribution) error {
	return usecase.storage.Create(contribution)
}
