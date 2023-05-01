package dto

import "github.com/gofrs/uuid"

type ContributionDTO struct {
	ID uuid.UUID `json:"id"`

	Name  string `json:"name" form:"name"`
	Email string `json:"email" form:"email"`

	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	Transcription *string `json:"transcription" form:"transcription"`

	ArticleTypeID string `json:"article_type_id" form:"article_type_id"`
	WorkID        string `json:"work_id" form:"work_id"`
}
