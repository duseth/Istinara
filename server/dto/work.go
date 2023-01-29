package dto

import (
	"github.com/gofrs/uuid"
)

type WorkDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	DescriptionRu string `json:"description_ru"`
	DescriptionAr string `json:"description_ar"`

	PicturePath string `json:"picture_path"`
	Link        string `json:"link"`
	AuthorID    string `json:"author_id"`
}

type WorkInputForm struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	AuthorID string `json:"author_id" form:"author_id" binding:"omitempty,uuid"`
}

type WorkSingleResult struct {
	Data WorkDTO `json:"data"`
}

type WorkListResult struct {
	Data []WorkDTO `json:"data"`
}
