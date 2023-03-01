package models

import "github.com/gofrs/uuid"

type ArticleLink struct {
	Base

	ArticleID uuid.UUID `gorm:"type:uuid;column:article_id;index:link_idx,unique" json:"article_id"`
	LinkID    uuid.UUID `gorm:"type:uuid;column:link_id;index:link_idx,unique" json:"link_id"`
}
