package dto

import "github.com/gofrs/uuid"

type ArticleTypeDTO struct {
	ID uuid.UUID `json:"id"`

	NameRu string `json:"name_ru"`
	NameAr string `json:"name_ar"`

	PicturePath string `gorm:"column:picture_path" json:"picture_path"`
}

type ArticleTypeFormDTO struct {
	NameRu string `json:"name_ru" form:"name_ru"`
	NameAr string `json:"name_ar" form:"name_ar"`
}
