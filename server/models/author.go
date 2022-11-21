package models

type Author struct {
	Base

	NameRu string `gorm:"size:255;not null;unique" json:"name_ru" form:"name_ru"`
	NameAr string `gorm:"size:255;not null;unique" json:"name_ar" form:"name_ar"`

	ShortNameRu string `gorm:"size:255;not null;unique" json:"short_name_ru" form:"short_name_ru"`
	ShortNameAr string `gorm:"size:255;not null;unique" json:"short_name_ar" form:"short_name_ar"`

	BiographyRu string `gorm:"size:255;not null;unique" json:"biography_ru" form:"biography_ru"`
	BiographyAr string `gorm:"size:255;not null;unique" json:"biography_ar" form:"biography_ar"`

	PicturePath string `gorm:"size:255;not null;unique" json:"picture_path" form:"picture_path"`
	Works       []Work `json:"works"`
}
