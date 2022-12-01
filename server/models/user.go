package models

import (
	"errors"
	"html"
	"strings"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	Base
	Username string `gorm:"size:255;not null;unique" json:"username" form:"username" binding:"required"`
	Email    string `gorm:"size:255;not null;unique" json:"email" form:"email" binding:"required"`
	Password string `gorm:"size:255;not null;" json:"password" form:"password" binding:"required"`
}

func (user *User) BeforeSave(_ *gorm.DB) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hash)
	user.Username = html.EscapeString(strings.TrimSpace(user.Username))

	return nil
}

func GetUserByID(uid uuid.UUID) (User, error) {
	var user User

	if err := DB.First(&user, uid).Error; err != nil {
		return user, errors.New("user not found")
	}

	user.PrepareGive()
	return user, nil
}

func (user *User) PrepareGive() {
	user.Password = ""
}
