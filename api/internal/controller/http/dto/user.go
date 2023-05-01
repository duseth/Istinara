package dto

import (
	"time"

	"github.com/gofrs/uuid"
)

type UserDTO struct {
	ID           uuid.UUID  `json:"id"`
	Username     string     `json:"username"`
	Email        string     `json:"email"`
	IsPrivileged bool       `json:"is_privileged"`
	CreatedAt    *time.Time `json:"created_at"`
}

type UpdateUserInputForm struct {
	Username string `json:"username" form:"username"`
	Email    string `json:"email" form:"email"`
}

type ChangePasswordInputForm struct {
	Password    string `json:"password" form:"password"`
	NewPassword string `json:"new_password" form:"new_password"`
}
