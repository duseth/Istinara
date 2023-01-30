package models

type Request struct {
	Base

	Name  string `gorm:"column:name;not null"`
	Email string `gorm:"column:email;not null;unique"`

	TitleRu string `gorm:"column:title_ru"`
	TitleAr string `gorm:"column:title_ar"`

	QuoteRu string `gorm:"column:quote_ru"`
	QuoteAr string `gorm:"column:quote_ar"`

	DescriptionRu string `gorm:"column:description_ru"`
	DescriptionAr string `gorm:"column:description_ar"`

	WorkID string `gorm:"column:work_id"`
	Work   Work

	AuthorID string `gorm:"column:author_id"`
	Author   Author
}
