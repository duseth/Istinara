package model

import (
	"html"
	"strings"

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
