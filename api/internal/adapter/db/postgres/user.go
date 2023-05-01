package storage

import (
	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

type UserStorage struct {
	db *gorm.DB
}

func NewUserStorage(db *gorm.DB) *UserStorage {
	return &UserStorage{db: db}
}

func (storage UserStorage) Get(email string) (model.User, error) {
	var user model.User
	err := storage.db.Where("email = ?", email).Take(&user).Error
	if err != nil {
		return model.User{}, err
	}

	return user, nil
}

func (storage UserStorage) Create(user model.User) error {
	err := storage.db.Create(&user).Error
	if err != nil {
		return err
	}

	return nil
}

func (storage UserStorage) Update(id string, user model.User) (model.User, error) {
	var originUser model.User
	err := storage.db.Where("id = ?", id).First(&originUser).Error
	if err != nil {
		return model.User{}, err
	}

	err = storage.db.Model(&originUser).Updates(user).Error
	if err != nil {
		return model.User{}, err
	}

	return originUser, nil
}
