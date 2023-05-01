package usecase

import (
	"context"

	"github.com/duseth/istinara/api/internal/domain/model"
)

type UserStorage interface {
	Get(email string) (model.User, error)
	Create(user model.User) error
	Update(id string, user model.User) (model.User, error)
}

type FavouriteStorage interface {
	Create(favourite model.Favourite) error
	Get(userID string, articleID string) (model.Favourite, error)
	Delete(userID string, articleID string) error

	List(userID string) ([]model.Favourite, error)
	ListArticles(ctx context.Context, userID string) ([]model.Article, int64, error)
}

type UserUsecase struct {
	userStorage       UserStorage
	favouritesStorage FavouriteStorage
}

func NewUserUsecase(userService UserStorage, favouritesService FavouriteStorage) *UserUsecase {
	return &UserUsecase{
		userStorage:       userService,
		favouritesStorage: favouritesService,
	}
}

func (usecase UserUsecase) Get(email string) (model.User, error) {
	return usecase.userStorage.Get(email)
}

func (usecase UserUsecase) Create(user model.User) error {
	return usecase.userStorage.Create(user)
}

func (usecase UserUsecase) Update(id string, user model.User) (model.User, error) {
	return usecase.userStorage.Update(id, user)
}

func (usecase UserUsecase) ListFavourites(ctx context.Context, userID string) ([]model.Article, int64, error) {
	articles, count, err := usecase.favouritesStorage.ListArticles(ctx, userID)
	if err != nil {
		return nil, 0, err
	}

	for i := range articles {
		articles[i].IsLiked = true
	}
	return articles, count, nil
}

func (usecase UserUsecase) CreateFavourite(favourite model.Favourite) error {
	return usecase.favouritesStorage.Create(favourite)
}

func (usecase UserUsecase) DeleteFavourite(userID string, articleID string) error {
	return usecase.favouritesStorage.Delete(userID, articleID)
}
