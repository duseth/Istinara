package model

type Article struct {
	Base

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	QuoteRu string `gorm:"column:quote_ru" json:"quote_ru"`
	QuoteAr string `gorm:"column:quote_ar" json:"quote_ar"`

	QuoteRuHighlight string `gorm:"column:quote_ru_highlight" json:"quote_ru_highlight"`
	QuoteArHighlight string `gorm:"column:quote_ar_highlight" json:"quote_ar_highlight"`

	DescriptionRu string `gorm:"column:description_ru" json:"description_ru"`
	DescriptionAr string `gorm:"column:description_ar" json:"description_ar"`

	Link          string `gorm:"column:link;index:unique" json:"link"`
	PicturePath   string `gorm:"column:picture_path" json:"picture_path"`
	Transcription string `gorm:"column:transcription" json:"transcription"`

	ArticleTypeID string      `gorm:"column:article_type_id" json:"article_type_id"`
	ArticleType   ArticleType `gorm:"constraint:OnDelete:SET NULL;"`

	WorkID string `gorm:"column:work_id" json:"work_id"`
	Work   Work   `gorm:"constraint:OnDelete:SET NULL;"`

	IsLiked bool `gorm:"-" json:"is_liked"`
}
