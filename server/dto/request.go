package dto

import (
	"github.com/gofrs/uuid"
)

type RequestDTO struct {
	ID uuid.UUID `json:"id"`

	Name  string `json:"name"`
	Email string `json:"email"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	QuoteRu string `json:"quote_ru"`
	QuoteAr string `json:"quote_ar"`

	DescriptionRu string `json:"description_ru"`
	DescriptionAr string `json:"description_ar"`

	WorkID   string `json:"work_id"`
	AuthorID string `json:"author_id"`
}

type RequestInputForm struct {
	Name  string `json:"name" form:"name"`
	Email string `json:"email" form:"name"`

	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	WorkID   string `json:"work_id" binding:"uuid"`
	AuthorID string `json:"author_id" binding:"uuid"`
}
