package models

import "github.com/duseth/istinara/server/dto"

type Request struct {
	Base

	Name  string `gorm:"column:name;not null"`
	Email string `gorm:"column:email;not null"`

	Title       string `gorm:"column:title"`
	Quote       string `gorm:"column:quote"`
	Description string `gorm:"column:description"`

	WorkID string `gorm:"column:work_id"`
	Work   Work

	AuthorID string `gorm:"column:author_id"`
	Author   Author
}

// ToDTO map Request to dto.RequestDTO
func (request *Request) ToDTO() dto.RequestDTO {
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

// ParseForm parse Request from dto.RequestInputForm
func (request *Request) ParseForm(form dto.RequestInputForm) {
	request.Name = form.Name
	request.Email = form.Email
	request.Title = form.Title
	request.Quote = form.Quote
	request.Description = form.Description
	request.WorkID = form.WorkID
	request.AuthorID = form.AuthorID
}
