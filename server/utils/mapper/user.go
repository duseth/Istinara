package mapper

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
)

// MapUser map models.User to dto.UserDTO
func MapUser(user models.User) dto.UserDTO {
	return dto.UserDTO{
		ID:           user.ID,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
		DeletedAt:    user.DeletedAt,
		Username:     user.Username,
		Email:        user.Email,
		IsPrivileged: user.IsPrivileged,
	}
}

// ParseUser parse dto.RegisterInputForm into models.User
func ParseUser(userForm dto.RegisterInputForm, user *models.User) {
	user.Username = userForm.Username
	user.Email = userForm.Email
	user.Password = userForm.Password
}
