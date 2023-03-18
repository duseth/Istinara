package dto

import (
	"github.com/gofrs/uuid"
)

type ArticleDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	Link          string `json:"link"`
	PicturePath   string `json:"picture_path"`
	Transcription string `json:"transcription" form:"transcription"`
	IsLiked       bool   `json:"is_liked"`

	GroupID string   `form:"group_id"`
	Group   GroupDTO `json:"group"`

	WorkID string  `form:"work_id"`
	Work   WorkDTO `json:"work"`
}

type ArticleSingleResult struct {
	Data ArticleDTO `json:"data"`
}

type ArticleListResult struct {
	Data []ArticleDTO `json:"data"`
}
