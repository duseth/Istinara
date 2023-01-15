package mapper

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
)

// MapArticle map models.Article to dto.ArticleDTO
func MapArticle(article models.Article) dto.ArticleDTO {
	return dto.ArticleDTO{
		ID:            article.ID,
		CreatedAt:     article.CreatedAt,
		UpdatedAt:     article.UpdatedAt,
		DeletedAt:     article.DeletedAt,
		TitleRu:       article.TitleRu,
		TitleAr:       article.TitleAr,
		QuoteRu:       article.QuoteRu,
		QuoteAr:       article.QuoteAr,
		DescriptionRu: article.DescriptionRu,
		DescriptionAr: article.DescriptionAr,
		PicturePath:   article.PicturePath,
		Transcription: article.Transcription,
		WorkID:        article.WorkID,
	}
}

// MapArticles map array of models.Article to dto.ArticleDTO array
func MapArticles(articles []models.Article) []dto.ArticleDTO {
	articleDTOs := make([]dto.ArticleDTO, 0, len(articles))

	for _, article := range articles {
		articleDTOs = append(articleDTOs, MapArticle(article))
	}

	return articleDTOs
}

// ParseArticle parse dto.ArticleInputForm into models.Article
func ParseArticle(articleForm dto.ArticleInputForm, article *models.Article) {
	article.TitleRu = articleForm.TitleRu
	article.TitleAr = articleForm.TitleAr
	article.QuoteRu = articleForm.QuoteRu
	article.QuoteAr = articleForm.QuoteAr
	article.DescriptionRu = articleForm.DescriptionRu
	article.DescriptionAr = articleForm.DescriptionAr
	article.Transcription = articleForm.Transcription
	article.WorkID = articleForm.WorkID
}
