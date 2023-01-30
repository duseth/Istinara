package mapper

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
)

// MapWork map models.Work to dto.WorkDTO
func MapWork(work models.Work) dto.WorkDTO {
	return dto.WorkDTO{
		ID:            work.ID,
		TitleRu:       work.TitleRu,
		TitleAr:       work.TitleAr,
		DescriptionRu: work.DescriptionRu,
		DescriptionAr: work.DescriptionAr,
		PicturePath:   work.PicturePath,
		Link:          work.Link,
		AuthorLink:    work.Author.Link,
	}
}

// MapWorks map array of models.Work to dto.WorkDTO array
func MapWorks(works []models.Work) []dto.WorkDTO {
	workDTOs := make([]dto.WorkDTO, 0, len(works))

	for _, work := range works {
		workDTOs = append(workDTOs, MapWork(work))
	}

	return workDTOs
}

// ParseWork parse dto.WorkInputForm into models.Work
func ParseWork(workForm dto.WorkInputForm, work *models.Work) {
	work.TitleRu = workForm.TitleRu
	work.TitleAr = workForm.TitleAr
	work.DescriptionRu = workForm.DescriptionRu
	work.DescriptionAr = workForm.DescriptionAr
	work.AuthorID = workForm.AuthorID
}
