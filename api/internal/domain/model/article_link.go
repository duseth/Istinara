package model

type ArticleLink struct {
	Base

	ArticleID string  `gorm:"type:uuid;column:article_id;index:link_idx,unique;" json:"article_id"`
	Article   Article `gorm:"constraint:OnDelete:CASCADE;"`

	LinkID string  `gorm:"type:uuid;column:link_id;index:link_idx,unique;" json:"link_id"`
	Link   Article `gorm:"constraint:OnDelete:CASCADE;"`
}
