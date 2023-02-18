package models

import "github.com/gofrs/uuid"

type Favourite struct {
	Base

	UserID    uuid.UUID `gorm:"type:uuid;column:user_id" json:"user_id"`
	ArticleID uuid.UUID `gorm:"type:uuid;column:article_id" json:"article_id"`
}
