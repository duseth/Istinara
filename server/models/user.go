package models

import (
	"errors"
	"html"
	"strings"

	"github.com/duseth/istinara/server/dto"
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	Base

	Username     string `gorm:"column:username;not null" json:"username"`
	Email        string `gorm:"column:email;not null;unique" json:"email"`
	Password     string `gorm:"column:password;not null" json:"password"`
	IsPrivileged bool   `gorm:"column:is_privileged;not null;default:false" json:"is_privileged"`
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

// ToDTO map User to dto.UserDTO
func (user *User) ToDTO() dto.UserDTO {
	return dto.UserDTO{
		CreatedAt: user.CreatedAt,
		Username:  user.Username,
		Email:     user.Email,
	}
}

// ParseForm parse User from dto.RegisterInputForm
func (user *User) ParseForm(form dto.RegisterInputForm) {
	user.Username = form.Username
	user.Email = form.Email
	user.Password = form.Password
}

func CheckIfUserIsPrivileged(uid uuid.UUID) (bool, error) {
	var user User

	if err := DB.First(&user, uid).Error; err != nil {
		return false, errors.New("user not found")
	}

	return user.IsPrivileged, nil
}
