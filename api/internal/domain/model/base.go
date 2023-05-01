package model

import (
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID uuid.UUID `gorm:"type:uuid;primary_key;" json:"id"`

	CreatedAt *time.Time     `gorm:"type:timestamp" json:"created_at"`
	UpdatedAt *time.Time     `gorm:"type:timestamp" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"type:timestamp" json:"deleted_at"`
}

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
