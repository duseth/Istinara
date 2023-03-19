package models

import "github.com/duseth/istinara/server/dto"

type Article struct {
	Base

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	QuoteRu string `gorm:"column:quote_ru" json:"quote_ru"`
	QuoteAr string `gorm:"column:quote_ar" json:"quote_ar"`

	DescriptionRu string `gorm:"column:description_ru" json:"description_ru"`
	DescriptionAr string `gorm:"column:description_ar" json:"description_ar"`

	Link          string `gorm:"column:link" json:"link"`
	PicturePath   string `gorm:"column:picture_path" json:"picture_path"`
	Transcription string `gorm:"column:transcription" json:"transcription"`

	GroupID string `gorm:"column:group_id" json:"group_id"`
	Group   Group

	WorkID string `gorm:"column:work_id" json:"work_id"`
	Work   Work
}

// ToDTO map Article to dto.ArticleDTO
func (article *Article) ToDTO() dto.ArticleDTO {
	return dto.ArticleDTO{
		ID:            article.ID,
		TitleRu:       article.TitleRu,
		TitleAr:       article.TitleAr,
		QuoteRu:       article.QuoteRu,
		QuoteAr:       article.QuoteAr,
		DescriptionRu: article.DescriptionRu,
		DescriptionAr: article.DescriptionAr,
		PicturePath:   article.PicturePath,
		Transcription: article.Transcription,
		Link:          article.Link,
		Group:         article.Group.ToDTO(),
		Work:          article.Work.ToDTO(),
	}
}

// ParseForm parse Article from dto.ArticleDTO
func (article *Article) ParseForm(form dto.ArticleDTO) {
	article.TitleRu = form.TitleRu
	article.TitleAr = form.TitleAr
	article.QuoteRu = form.QuoteRu
	article.QuoteAr = form.QuoteAr
	article.DescriptionRu = form.DescriptionRu
	article.DescriptionAr = form.DescriptionAr
	article.Transcription = form.Transcription
	article.PicturePath = form.PicturePath
	article.GroupID = form.GroupID
	article.WorkID = form.WorkID
}
