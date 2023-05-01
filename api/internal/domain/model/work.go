package model

import "time"

type Work struct {
	Base

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	AboutRu string `gorm:"column:about_ru" json:"about_ru"`
	AboutAr string `gorm:"column:about_ar" json:"about_ar"`

	GenreRu string `gorm:"column:genre_ru" json:"genre_ru"`
	GenreAr string `gorm:"column:genre_ar" json:"genre_ar"`

	Link            string     `gorm:"column:link;index:unique" json:"link"`
	PicturePath     string     `gorm:"column:picture_path" json:"picture_path"`
	PublicationDate *time.Time `gorm:"column:publication_date;type:date" json:"publication_date"`

	AuthorID string `gorm:"column:author_id" json:"author_id"`
	Author   Author `gorm:"constraint:OnDelete:SET NULL;"`
}
