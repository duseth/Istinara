package model

type ArticleType struct {
	Base

	NameRu string `gorm:"column:name_ru" json:"name_ru"`
	NameAr string `gorm:"column:name_ar" json:"name_ar"`

	PicturePath string `gorm:"column:picture_path" json:"picture_path"`
}
