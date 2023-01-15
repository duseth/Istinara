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

	Username     string `gorm:"column:username;not null"`
	Email        string `gorm:"column:email;not null;unique"`
	Password     string `gorm:"column:username;not null;"`
	IsPrivileged bool   `gorm:"column:is_privileged;not null;default:false"`
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

func CheckIfUserIsPrivileged(uid uuid.UUID) (bool, error) {
	var user User

	if err := DB.First(&user, uid).Error; err != nil {
		return false, errors.New("user not found")
	}

	return user.IsPrivileged, nil
}
