package dto

import (
	"github.com/gofrs/uuid"
)

type RequestDTO struct {
	ID uuid.UUID `json:"id"`

	Name  string `json:"name"`
	Email string `json:"email"`

	Title       string `json:"title"`
	Quote       string `json:"quote"`
	Description string `json:"description"`

	WorkID   string `json:"work_id"`
	AuthorID string `json:"author_id"`
}

type RequestInputForm struct {
	Name  string `json:"name" form:"name"`
	Email string `json:"email" form:"email"`

	Title       string `json:"title" form:"title"`
	Quote       string `json:"quote" form:"quote"`
	Description string `json:"description" form:"description"`

	WorkID   string `json:"work_id" form:"work_id" binding:"uuid"`
	AuthorID string `json:"author_id" form:"author_id" binding:"uuid"`
}
