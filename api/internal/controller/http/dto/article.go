package dto

import "github.com/gofrs/uuid"

type ArticleDto struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	QuoteRuHighlight string `json:"quote_ru_highlight"`
	QuoteArHighlight string `json:"quote_ar_highlight"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	Link          string `json:"link"`
	PicturePath   string `json:"picture_path"`
	Transcription string `json:"transcription" form:"transcription"`

	ArticleType ArticleTypeDTO `json:"article_type"`

	IsLiked bool `json:"is_liked"`
}

type ListArticleDto struct {
	Count int64        `json:"count"`
	Data  []ArticleDto `json:"data"`
}

type CompleteArticleDto struct {
	ArticleDto
	Work CompleteWorkDTO `json:"work"`
}

type ArticleSignatureDto struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	Link string `json:"link"`
}

type ArticleFormDto struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	QuoteRuHighlight string `json:"quote_ru_highlight" form:"quote_ru_highlight"`
	QuoteArHighlight string `json:"quote_ar_highlight" form:"quote_ar_highlight"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	Transcription string `json:"transcription" form:"transcription"`

	ArticleTypeID string `form:"article_type_id"`
	WorkID        string `form:"work_id"`
}
