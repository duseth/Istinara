package dto

type UserDTO struct {
	Username     string `json:"username" form:"username" binding:"required"`
	Email        string `json:"email" form:"email" binding:"required"`
	Password     string `json:"password" form:"password" binding:"required"`
	IsPrivileged bool   `json:"is_privileged"`
}
