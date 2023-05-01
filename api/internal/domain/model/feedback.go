package model

type Feedback struct {
	Base

	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`

	ArticleID string  `gorm:"type:uuid;column:article_id" json:"article_id"`
	Article   Article `gorm:"constraint:OnDelete:SET NULL;"`
}
