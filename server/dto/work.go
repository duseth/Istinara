package dto

import (
	"time"

	"github.com/gofrs/uuid"
)

type WorkDTO struct {
	ID uuid.UUID `json:"id"`

	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	AboutRu string `json:"about_ru" form:"about_ru"`
	AboutAr string `json:"about_ar" form:"about_ar"`

	GenreRu string `json:"genre_ru" form:"genre_ru"`
	GenreAr string `json:"genre_ar" form:"genre_ar"`

	Link            string    `json:"link" form:"link"`
	PicturePath     string    `json:"picture_path" form:"picture_path"`
	PublicationDate time.Time `json:"publication_date" form:"publication_date" time_format:"2006-01-02"`

	AuthorID string    `form:"author_id" binding:"omitempty,uuid"`
	Author   AuthorDTO `json:"author"`
}

type WorkSingleResult struct {
	Data WorkDTO `json:"data"`
}

type WorkListResult struct {
	Data []WorkDTO `json:"data"`
}
