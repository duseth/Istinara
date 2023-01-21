package models

type Work struct {
	Base

	TitleRu string `gorm:"column:title_ru"`
	TitleAr string `gorm:"column:title_ar"`

	DescriptionRu string `gorm:"column:description_ru"`
	DescriptionAr string `gorm:"column:description_ar"`

	PicturePath string `gorm:"column:picture_path"`
	AuthorID    string `gorm:"column:author_id"`
	Author      Author
}
