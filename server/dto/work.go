package dto

import (
	"github.com/duseth/istinara/server/utils/datatypes"
	"github.com/gofrs/uuid"
)

type WorkDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	AboutRu string `json:"about_ru"`
	AboutAr string `json:"about_ar"`

	GenreRu string `json:"genre_ru"`
	GenreAr string `json:"genre_ar"`

	Link            string         `json:"link"`
	PicturePath     string         `json:"picture_path"`
	PublicationDate datatypes.Date `json:"publication_date"`

	Author *AuthorDTO `json:"author"`
}

type WorkInputForm struct {
	TitleRu string `form:"title_ru"`
	TitleAr string `form:"title_ar"`

	AboutRu string `form:"about_ru"`
	AboutAr string `form:"about_ar"`

	GenreRu string `form:"genre_ru"`
	GenreAr string `form:"genre_ar"`

	PublicationDate datatypes.Date `form:"publication_date"`
	AuthorID        string         `form:"author_id" binding:"omitempty,uuid"`
}

type WorkSingleResult struct {
	Data WorkDTO `json:"data"`
}

type WorkListResult struct {
	Data []WorkDTO `json:"data"`
}
