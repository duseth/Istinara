package dto

import (
	"github.com/gofrs/uuid"
)

type WorkDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	DescriptionRu string `json:"description_ru"`
	DescriptionAr string `json:"description_ar"`

	GenreRu string `json:"genre_ru"`
	GenreAr string `json:"genre_ar"`

	Link            string `json:"link"`
	PicturePath     string `json:"picture_path"`
	PublicationYear int    `json:"publication_year"`

	Author AuthorDTO `json:"author"`
}

type WorkInputForm struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	GenreRu string `form:"genre_ru"`
	GenreAr string `form:"genre_ar"`

	PublicationYear int    `form:"publication_year"`
	AuthorID        string `json:"author_id" form:"author_id" binding:"omitempty,uuid"`
}

type WorkSingleResult struct {
	Data WorkDTO `json:"data"`
}

type WorkListResult struct {
	Data []WorkDTO `json:"data"`
}
