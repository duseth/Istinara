package models

import (
	"time"

	"github.com/duseth/istinara/server/dto"
)

type Author struct {
	Base

	NameRu string `gorm:"column:name_ru" json:"name_ru"`
	NameAr string `gorm:"column:name_ar" json:"name_ar"`

	ShortNameRu string `gorm:"column:short_name_ru" json:"short_name_ru"`
	ShortNameAr string `gorm:"column:short_name_ar" json:"short_name_ar"`

	AboutRu string `gorm:"column:about_ru" json:"about_ru"`
	AboutAr string `gorm:"column:about_ar" json:"about_ar"`

	BirthDate time.Time  `gorm:"column:birth_date" json:"birth_date"`
	DeathDate *time.Time `gorm:"column:death_date" json:"death_date,omitempty"`

	PicturePath string `gorm:"column:picture_path" json:"picture_path,omitempty"`
	Link        string `gorm:"column:link" json:"link,omitempty"`
}

// ToDTO map Author to dto.AuthorDTO
func (author *Author) ToDTO() dto.AuthorDTO {
	return dto.AuthorDTO{
		ID:          author.ID,
		NameRu:      author.NameRu,
		NameAr:      author.NameAr,
		ShortNameRu: author.ShortNameRu,
		ShortNameAr: author.ShortNameAr,
		AboutRu:     author.AboutRu,
		AboutAr:     author.AboutAr,
		BirthDate:   author.BirthDate,
		DeathDate:   author.DeathDate,
		PicturePath: author.PicturePath,
		Link:        author.Link,
	}
}

// ParseForm parse Author from dto.AuthorDTO
func (author *Author) ParseForm(form dto.AuthorDTO) {
	author.NameRu = form.NameRu
	author.NameAr = form.NameAr
	author.ShortNameRu = form.ShortNameRu
	author.ShortNameAr = form.ShortNameAr
	author.AboutRu = form.AboutRu
	author.AboutAr = form.AboutAr
	author.BirthDate = form.BirthDate
	author.DeathDate = form.DeathDate
}
