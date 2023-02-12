package models

import (
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

// Base contains common columns for all tables
type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time `gorm:"index"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (base *Base) BeforeCreate(_ *gorm.DB) error {
	if base.ID == uuid.Nil {
		id, err := uuid.NewV4()
		if err != nil {
			return err
		}

		base.ID = id
	}

	return nil
}
