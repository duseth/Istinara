package model

import "github.com/gofrs/uuid"

type Favourite struct {
	Base

	UserID uuid.UUID `gorm:"type:uuid;column:user_id;index:fav_idx,unique,where:deleted_at is null;" json:"user_id"`
	User   User      `gorm:"constraint:OnDelete:CASCADE;"`

	ArticleID uuid.UUID `gorm:"type:uuid;column:article_id;index:fav_idx,unique,where:deleted_at is null;" json:"article_id"`
	Article   Article   `gorm:"constraint:OnDelete:CASCADE;"`
}
