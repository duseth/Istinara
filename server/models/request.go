package models

type Request struct {
	Base

	Name  string `gorm:"column:name;not null"`
	Email string `gorm:"column:email;not null"`

	Title       string `gorm:"column:title"`
	Quote       string `gorm:"column:quote"`
	Description string `gorm:"column:description"`

	WorkID string `gorm:"column:work_id"`
	Work   Work

	AuthorID string `gorm:"column:author_id"`
	Author   Author
}
