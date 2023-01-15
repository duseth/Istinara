package dto

import (
	"time"

	"github.com/gofrs/uuid"
)

type AuthorDTO struct {
	ID uuid.UUID `json:"id"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`

	NameRu string `json:"name_ru"`
	NameAr string `json:"name_ar"`

	ShortNameRu string `json:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar"`

	BiographyRu string `json:"biography_ru"`
	BiographyAr string `json:"biography_ar"`

	PicturePath string `json:"picture_path"`
}

type AuthorInputForm struct {
	NameRu string `json:"name_ru" form:"name_ru"`
	NameAr string `json:"name_ar" form:"name_ar"`

	ShortNameRu string `json:"short_name_ru" form:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar" form:"short_name_ar"`

	BiographyRu string `json:"biography_ru" form:"biography_ru"`
	BiographyAr string `json:"biography_ar" form:"biography_ar"`
}

type AuthorSingleResult struct {
	Data AuthorDTO `json:"data"`
}

type AuthorListResult struct {
	Data []AuthorDTO `json:"data"`
}
