package mapper

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
)

// MapRequest map models.Request to dto.RequestDTO
func MapRequest(request models.Request) dto.RequestDTO {
	return dto.RequestDTO{
		ID:            request.ID,
		Name:          request.Name,
		Email:         request.Email,
		TitleRu:       request.TitleRu,
		TitleAr:       request.TitleAr,
		QuoteRu:       request.QuoteRu,
		QuoteAr:       request.QuoteAr,
		DescriptionRu: request.DescriptionRu,
		DescriptionAr: request.DescriptionAr,
		AuthorID:      request.AuthorID,
		WorkID:        request.WorkID,
	}
}

// MapRequests map array of models.Request to dto.RequestDTO array
func MapRequests(requests []models.Request) []dto.RequestDTO {
	requestDTOs := make([]dto.RequestDTO, 0, len(requests))

	for _, request := range requests {
		requestDTOs = append(requestDTOs, MapRequest(request))
	}

	return requestDTOs
}

// ParseRequest parse dto.RequestInputForm into models.Request
func ParseRequest(requestForm dto.RequestInputForm, request *models.Request) {
	request.Name = requestForm.Name
	request.Email = requestForm.Email
	request.TitleRu = requestForm.TitleRu
	request.TitleAr = requestForm.TitleAr
	request.QuoteRu = requestForm.QuoteRu
	request.QuoteAr = requestForm.QuoteAr
	request.DescriptionRu = requestForm.DescriptionRu
	request.DescriptionAr = requestForm.DescriptionAr
	request.WorkID = requestForm.WorkID
	request.AuthorID = requestForm.AuthorID
}
