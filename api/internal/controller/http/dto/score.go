package dto

type ScoresDTO struct {
	AuthorsCount  int64 `json:"authors_count"`
	WorksCount    int64 `json:"works_count"`
	ArticlesCount int64 `json:"articles_count"`

	ArticleTypesCount int64 `json:"article_types_count"`
	Contributions     int64 `json:"contributions_count"`
}
