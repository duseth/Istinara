package dto

import (
	"time"

	"github.com/gofrs/uuid"
)

type UserDTO struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`

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

type EditUserForm struct {
	Username string `json:"username" form:"username"`
	Email    string `json:"email" form:"email"`
}

type ChangePasswordForm struct {
	Email             string `json:"email" form:"email"`
	CurrentPassword   string `json:"current_password" form:"current_password"`
	NewPassword       string `json:"new_password" form:"new_password"`
	AcceptNewPassword string `json:"accept_new_password" form:"accept_new_password"`
}
