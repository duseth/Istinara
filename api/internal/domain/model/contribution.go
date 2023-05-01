package model

type Contribution struct {
	Base

	Name  string `gorm:"column:name;not null"`
	Email string `gorm:"column:email;not null"`

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	QuoteRu string `gorm:"column:quote_ru" json:"quote_ru"`
	QuoteAr string `gorm:"column:quote_ar" json:"quote_ar"`

	DescriptionRu string `gorm:"column:description_ru" json:"description_ru"`
	DescriptionAr string `gorm:"column:description_ar" json:"description_ar"`

	Transcription *string `gorm:"column:transcription" json:"transcription"`

	ArticleTypeID string      `gorm:"column:article_type_id"`
	ArticleType   ArticleType `gorm:"constraint:OnDelete:SET NULL;"`

	WorkID string `gorm:"column:work_id"`
	Work   Work   `gorm:"constraint:OnDelete:SET NULL;"`
}
