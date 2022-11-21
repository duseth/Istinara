package models

type Work struct {
	Base

	TitleRu string `gorm:"size:255;not null;unique" json:"title_ru" form:"title_ru"`
	TitleAr string `gorm:"size:255;not null;unique" json:"title_ar" form:"title_ar"`

	DescriptionRu string `gorm:"size:255;not null;unique" json:"description_ru" form:"description_ru"`
	DescriptionAr string `gorm:"size:255;not null;unique" json:"description_ar" form:"description_ar"`

	AuthorID    string    `json:"author_id" form:"author_id" binding:"omitempty,uuid"`
	PicturePath string    `gorm:"size:255;not null;unique" json:"picture_path"`
	Articles    []Article `json:"articles"`
}
