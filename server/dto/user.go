package dto

import (
	"time"

	"github.com/gofrs/uuid"
)

type UserDTO struct {
	ID uuid.UUID `json:"id"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`

	Username string `json:"username"`
	Email    string `json:"email"`

	IsPrivileged bool `json:"is_privileged"`
}

type LoginInputForm struct {
	Email    string `json:"email" form:"email" binding:"required"`
	Password string `json:"password" form:"password" binding:"required"`
}

type LoginResult struct {
	Data LoginResponse `json:"data"`
}

type LoginResponse struct {
	User  UserDTO `json:"user"`
	Token string  `json:"token"`
}

type RegisterInputForm struct {
	Username string `json:"username" form:"username" binding:"required"`
	Email    string `json:"email" form:"email" binding:"required"`
	Password string `json:"password" form:"password" binding:"required"`
}
