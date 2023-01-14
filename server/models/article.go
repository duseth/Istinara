package models

type Article struct {
	Base

	TitleRu string `gorm:"column:title_ru"`
	TitleAr string `gorm:"column:title_ar"`

	QuoteRu string `gorm:"column:quote_ru"`
	QuoteAr string `gorm:"column:quote_ar"`

	DescriptionRu string `gorm:"column:description_ru"`
	DescriptionAr string `gorm:"column:description_ar"`

	Transcription string `gorm:"column:transcription"`
	PicturePath   string `gorm:"column:picture_path"`
	WorkID        string `gorm:"column:work_id"`
}
