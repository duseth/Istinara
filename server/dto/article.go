package dto

import (
	"github.com/gofrs/uuid"
)

type ArticleDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	QuoteRu string `json:"quote_ru"`
	QuoteAr string `json:"quote_ar"`

	DescriptionRu string `json:"description_ru"`
	DescriptionAr string `json:"description_ar"`

	PicturePath   string `json:"picture_path"`
	Transcription string `json:"transcription"`
	Link          string `json:"link"`

	WorkID string `json:"work_id"`
}

type ArticleInputForm struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	Transcription string `json:"transcription" form:"transcription"`
	WorkID        string `json:"work_id" binding:"uuid"`
}

type ArticleSingleResult struct {
	Data ArticleDTO `json:"data"`
}

type ArticleListResult struct {
	Data []ArticleDTO `json:"data"`
}
