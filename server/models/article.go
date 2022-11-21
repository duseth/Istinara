package models

type Article struct {
	Base

	TitleRu string `gorm:"size:255;not null;unique" json:"title_ru" form:"title_ru"`
	TitleAr string `gorm:"size:255;not null;unique" json:"title_ar" form:"title_ar"`

	QuoteRu string `gorm:"size:255;not null;unique" json:"quote_ru" form:"quote_ru"`
	QuoteAr string `gorm:"size:255;not null;unique" json:"quote_ar" form:"quote_ar"`

	DescriptionRu string `gorm:"size:255;not null;unique" json:"description_ru" form:"description_ru"`
	DescriptionAr string `gorm:"size:255;not null;unique" json:"description_ar" form:"description_ar"`

	Transcription string `gorm:"size:255;not null;unique" json:"transcription" form:"transcription"`
	PicturePath   string `gorm:"size:255;not null;unique" json:"picture_path"`
	WorkID        string `json:"work_id" binding:"uuid"`
}
