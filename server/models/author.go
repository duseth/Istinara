package models

type Author struct {
	Base

	NameRu string `gorm:"column:name_ru" json:"name_ru"`
	NameAr string `gorm:"column:name_ar" json:"name_ar"`

	ShortNameRu string `gorm:"column:short_name_ru" json:"short_name_ru"`
	ShortNameAr string `gorm:"column:short_name_ar" json:"short_name_ar"`

	AboutRu string `gorm:"column:about_ru" json:"about_ru"`
	AboutAr string `gorm:"column:about_ar" json:"about_ar"`

	BiographyRu string `gorm:"column:biography_ru" json:"biography_ru"`
	BiographyAr string `gorm:"column:biography_ar" json:"biography_ar"`

	PicturePath string `gorm:"column:picture_path" json:"picture_path"`
	Link        string `gorm:"column:link" json:"link"`
}
