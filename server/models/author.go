package models

type Author struct {
	Base

	NameRu string `gorm:"column:name_ru"`
	NameAr string `gorm:"column:name_ar"`

	ShortNameRu string `gorm:"column:short_name_ru"`
	ShortNameAr string `gorm:"column:short_name_ar"`

	BiographyRu string `gorm:"column:biography_ru"`
	BiographyAr string `gorm:"column:biography_ar"`

	PicturePath string `gorm:"column:picture_path"`
	Link        string `gorm:"column:link"`
}
