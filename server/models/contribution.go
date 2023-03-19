package models

import "github.com/duseth/istinara/server/dto"

type Contribution struct {
	Base

	Name  string `gorm:"column:name;not null"`
	Email string `gorm:"column:email;not null"`

	TitleRu string `gorm:"column:title_ru" json:"title_ru"`
	TitleAr string `gorm:"column:title_ar" json:"title_ar"`

	QuoteRu string `gorm:"column:quote_ru" json:"quote_ru"`
	QuoteAr string `gorm:"column:quote_ar" json:"quote_ar"`

	DescriptionRu string `gorm:"column:description_ru" json:"description_ru"`
	DescriptionAr string `gorm:"column:description_ar" json:"description_ar"`

	GroupID string `gorm:"column:group_id"`
	Group   Group  `gorm:"constraint:OnDelete:CASCADE;"`

	WorkID string `gorm:"column:work_id"`
	Work   Work   `gorm:"constraint:OnDelete:CASCADE;"`
}

// ToDTO map Contribution to dto.ContributionDTO
func (request *Contribution) ToDTO() dto.ContributionDTO {
	return dto.ContributionDTO{
		ID:            request.ID,
		Name:          request.Name,
		Email:         request.Email,
		TitleRu:       request.TitleRu,
		TitleAr:       request.TitleAr,
		QuoteRu:       request.QuoteRu,
		QuoteAr:       request.QuoteAr,
		DescriptionRu: request.DescriptionRu,
		DescriptionAr: request.DescriptionAr,
		GroupID:       request.GroupID,
		WorkID:        request.WorkID,
	}
}

// ParseForm parse Contribution from dto.ContributionInputForm
func (request *Contribution) ParseForm(form dto.ContributionDTO) {
	request.Name = form.Name
	request.Email = form.Email
	request.TitleRu = form.TitleRu
	request.TitleAr = form.TitleAr
	request.QuoteRu = form.QuoteRu
	request.QuoteAr = form.QuoteAr
	request.DescriptionRu = form.DescriptionRu
	request.DescriptionAr = form.DescriptionAr
	request.GroupID = form.GroupID
	request.WorkID = form.WorkID
}
