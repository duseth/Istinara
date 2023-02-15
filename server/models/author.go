package models

import (
	"github.com/duseth/istinara/server/utils/datatypes"
)

type Author struct {
	Base

	NameRu string `gorm:"column:name_ru" json:"name_ru"`
	NameAr string `gorm:"column:name_ar" json:"name_ar"`

	ShortNameRu string `gorm:"column:short_name_ru" json:"short_name_ru"`
	ShortNameAr string `gorm:"column:short_name_ar" json:"short_name_ar"`

	AboutRu string `gorm:"column:about_ru" json:"about_ru"`
	AboutAr string `gorm:"column:about_ar" json:"about_ar"`

	BirthDate datatypes.Date  `gorm:"column:birth_date" json:"birth_date"`
	DeathDate *datatypes.Date `gorm:"column:death_date" json:"death_date,omitempty"`

	PicturePath string `gorm:"column:picture_path" json:"picture_path"`
	Link        string `gorm:"column:link" json:"link"`
}
