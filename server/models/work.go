package models

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/utils/datatypes"
)

type Work struct {
	Base

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	AboutRu string `gorm:"column:about_ru" json:"about_ru"`
	AboutAr string `gorm:"column:about_ar" json:"about_ar"`

	GenreRu string `gorm:"column:genre_ru" json:"genre_ru"`
	GenreAr string `gorm:"column:genre_ar" json:"genre_ar"`

	Link            string         `gorm:"column:link" json:"link"`
	PicturePath     string         `gorm:"column:picture_path" json:"picture_path"`
	PublicationDate datatypes.Date `gorm:"column:publication_date" json:"publication_date"`

	AuthorID string `gorm:"column:author_id" json:"author_id"`
	Author   Author
}

// ToDTO map struct to dto.WorkDTO
func (work *Work) ToDTO() dto.WorkDTO {
	return dto.WorkDTO{
		ID:              work.ID,
		TitleRu:         work.TitleRu,
		TitleAr:         work.TitleAr,
		GenreRu:         work.GenreRu,
		GenreAr:         work.GenreAr,
		AboutRu:         work.AboutRu,
		AboutAr:         work.AboutAr,
		PublicationDate: work.PublicationDate,
		PicturePath:     work.PicturePath,
		Link:            work.Link,
	}
}

// ParseForm parse Work from models.Work
func (work *Work) ParseForm(form dto.WorkInputForm) {
	work.TitleRu = form.TitleRu
	work.TitleAr = form.TitleAr
	work.GenreRu = form.GenreRu
	work.GenreAr = form.GenreAr
	work.AboutRu = form.AboutRu
	work.AboutAr = form.AboutAr
	work.PublicationDate = form.PublicationDate
	work.AuthorID = form.AuthorID
}
