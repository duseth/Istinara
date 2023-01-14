package dto

type AuthorDTO struct {
	NameRu string `json:"name_ru" form:"name_ru"`
	NameAr string `json:"name_ar" form:"name_ar"`

	ShortNameRu string `json:"short_name_ru" form:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar" form:"short_name_ar"`

	BiographyRu string `json:"biography_ru" form:"biography_ru"`
	BiographyAr string `json:"biography_ar" form:"biography_ar"`

	PicturePath string    `json:"picture_path" form:"picture_path"`
	Works       []WorkDTO `json:"works"`
}
