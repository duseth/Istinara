package mapper

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
)

// MapAuthor map models.Author to dto.AuthorDTO
func MapAuthor(author models.Author) dto.AuthorDTO {
	return dto.AuthorDTO{
		ID:          author.ID,
		CreatedAt:   author.CreatedAt,
		UpdatedAt:   author.UpdatedAt,
		DeletedAt:   author.DeletedAt,
		NameRu:      author.NameRu,
		NameAr:      author.NameAr,
		ShortNameRu: author.ShortNameRu,
		ShortNameAr: author.ShortNameAr,
		BiographyRu: author.BiographyRu,
		BiographyAr: author.BiographyAr,
		PicturePath: author.PicturePath,
	}
}

// MapAuthors map array of models.Author to dto.AuthorDTO array
func MapAuthors(authors []models.Author) []dto.AuthorDTO {
	authorDTOs := make([]dto.AuthorDTO, 0, len(authors))

	for _, author := range authors {
		authorDTOs = append(authorDTOs, MapAuthor(author))
	}

	return authorDTOs
}

// ParseAuthor parse dto.AuthorInputForm into models.Author
func ParseAuthor(authorForm dto.AuthorInputForm, author *models.Author) {
	author.NameRu = authorForm.NameRu
	author.NameAr = authorForm.NameAr
	author.ShortNameRu = authorForm.ShortNameRu
	author.ShortNameAr = authorForm.ShortNameAr
	author.BiographyRu = authorForm.BiographyRu
	author.BiographyAr = authorForm.BiographyAr
}