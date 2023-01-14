package dto

type WorkDTO struct {
	TitleRu string `json:"title_ru" form:"title_ru"`
	TitleAr string `json:"title_ar" form:"title_ar"`

	DescriptionRu string `json:"description_ru" form:"description_ru"`
	DescriptionAr string `json:"description_ar" form:"description_ar"`

	AuthorID    string       `json:"author_id" form:"author_id" binding:"omitempty,uuid"`
	PicturePath string       `json:"picture_path"`
	Articles    []ArticleDTO `json:"articles"`
}
