package models

type Work struct {
	Base

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	DescriptionRu string `gorm:"column:description_ru" json:"description_ru"`
	DescriptionAr string `gorm:"column:description_ar" json:"description_ar"`

	GenreRu string `gorm:"column:genre_ru" json:"genre_ru"`
	GenreAr string `gorm:"column:genre_ar" json:"genre_ar"`

	Link            string `gorm:"column:link" json:"link"`
	PicturePath     string `gorm:"column:picture_path" json:"picture_path"`
	PublicationYear int    `gorm:"column:publication_year" json:"publication_year"`

	AuthorID string `gorm:"column:author_id" json:"author_id"`
	Author   Author
}
