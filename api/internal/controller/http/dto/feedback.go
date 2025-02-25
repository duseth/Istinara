package dto

import "github.com/gofrs/uuid"

type FeedbackDTO struct {
	ID uuid.UUID `json:"id"`

	Title       string `json:"title"`
	Description string `json:"description"`

	ArticleID uuid.UUID `json:"article_id"`
	Article   ArticleDto
}

type FeedbackFormDTO struct {
	Title       string `json:"title" form:"title"`
	Description string `json:"description" form:"description"`
}
