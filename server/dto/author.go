package dto

import (
	"github.com/duseth/istinara/server/utils/datatypes"
	"github.com/gofrs/uuid"
)

type AuthorDTO struct {
	ID uuid.UUID `json:"id"`

	NameRu string `json:"name_ru"`
	NameAr string `json:"name_ar"`

	ShortNameRu string `json:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar"`

	AboutRu string `json:"about_ru"`
	AboutAr string `json:"about_ar"`

	BirthDate datatypes.Date  `json:"birth_date"`
	DeathDate *datatypes.Date `json:"death_date,omitempty"`

	PicturePath string `json:"picture_path"`
	Link        string `json:"link"`
}

type AuthorInputForm struct {
	NameRu string `json:"name_ru" form:"name_ru"`
	NameAr string `json:"name_ar" form:"name_ar"`

	ShortNameRu string `json:"short_name_ru" form:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar" form:"short_name_ar"`

	AboutRu string `json:"about_ru"`
	AboutAr string `json:"about_ar"`

	BirthDate datatypes.Date  `json:"birth_date" form:"birth_date"`
	DeathDate *datatypes.Date `json:"death_date,omitempty" form:"death_date"`
}

type AuthorSingleResult struct {
	Data AuthorDTO `json:"data"`
}

type AuthorListResult struct {
	Data []AuthorDTO `json:"data"`
}
