package models

import "github.com/gofrs/uuid"

type Favourite struct {
	Base

	UserID    uuid.UUID `gorm:"type:uuid;column:user_id;index:fav_idx,unique" json:"user_id"`
	ArticleID uuid.UUID `gorm:"type:uuid;column:article_id;index:fav_idx,unique" json:"article_id"`
}
