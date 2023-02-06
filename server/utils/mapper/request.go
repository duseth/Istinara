package mapper

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
)

// MapRequest map models.Request to dto.RequestDTO
func MapRequest(request models.Request) dto.RequestDTO {
	return dto.RequestDTO{
		ID:          request.ID,
		Name:        request.Name,
		Email:       request.Email,
		Title:       request.Title,
		Quote:       request.Quote,
		Description: request.Description,
		AuthorID:    request.AuthorID,
		WorkID:      request.WorkID,
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
	request.Title = requestForm.Title
	request.Quote = requestForm.Quote
	request.Description = requestForm.Description
	request.WorkID = requestForm.WorkID
	request.AuthorID = requestForm.AuthorID
}
