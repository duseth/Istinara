package dto

import (
	"time"

	"github.com/gofrs/uuid"
)

type AuthorDTO struct {
	ID uuid.UUID `json:"id"`

	NameRu string `json:"name_ru" form:"name_ru"`
	NameAr string `json:"name_ar" form:"name_ar"`

	ShortNameRu string `json:"short_name_ru" form:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar" form:"short_name_ar"`

	AboutRu string `json:"about_ru" form:"about_ru"`
	AboutAr string `json:"about_ar" form:"about_ar"`

	BirthDate time.Time  `json:"birth_date" form:"birth_date" time_format:"2006-01-02"`
	DeathDate *time.Time `json:"death_date,omitempty" form:"death_date" binding:"omitempty" time_format:"2006-01-02"`

	PicturePath string `json:"picture_path"`
	Link        string `json:"link"`
}

type AuthorSingleResult struct {
	Data AuthorDTO `json:"data"`
}

type AuthorListResult struct {
	Data []AuthorDTO `json:"data"`
}
