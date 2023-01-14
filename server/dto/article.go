package dto

type ArticleDTO struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	QuoteRu string `json:"quote_ru" form:"quote_ru"`
	QuoteAr string `json:"quote_ar" form:"quote_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	Transcription string `json:"transcription" form:"transcription"`
	PicturePath   string `json:"picture_path"`
	WorkID        string `json:"work_id" binding:"uuid"`
}
