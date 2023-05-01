package dto

import (
	"time"

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

	Link            string     `json:"link"`
	PicturePath     string     `json:"picture_path"`
	PublicationDate *time.Time `json:"publication_date" form:"publication_date" time_format:"2006-01-02"`
}

type CompleteWorkDTO struct {
	WorkDTO
	Author AuthorDTO `json:"author"`
}

type WorkNamesDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru"`
	TitleAr string `json:"title_ar"`

	Link string `json:"link"`
}

type ListWorkDTO struct {
	Count int64     `json:"count"`
	Data  []WorkDTO `json:"data"`
}

type WorkFormDTO struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	AboutRu string `json:"about_ru" form:"about_ru"`
	AboutAr string `json:"about_ar" form:"about_ar"`

	GenreRu string `json:"genre_ru" form:"genre_ru"`
	GenreAr string `json:"genre_ar" form:"genre_ar"`

	PublicationDate *time.Time `json:"publication_date" form:"publication_date" time_format:"2006-01-02"`
	AuthorID        string     `form:"author_id"`
}
