package model

import (
	"time"

	"github.com/gofrs/uuid"
)

type Favourite struct {
	CreatedAt *time.Time `gorm:"type:timestamp" json:"created_at"`

	UserID uuid.UUID `gorm:"type:uuid;column:user_id;index:fav_idx,unique;" json:"user_id"`
	User   User      `gorm:"constraint:OnDelete:CASCADE;"`

	ArticleID uuid.UUID `gorm:"type:uuid;column:article_id;index:fav_idx,unique;" json:"article_id"`
	Article   Article   `gorm:"constraint:OnDelete:CASCADE;"`
}
