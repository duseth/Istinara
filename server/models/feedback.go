package models

import (
	"github.com/duseth/istinara/server/dto"
	"github.com/gofrs/uuid"
)

type Feedback struct {
	Base

	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`

	ArticleID uuid.UUID `gorm:"type:uuid;column:article_id" json:"article_id"`
	Article   Article   `gorm:"constraint:OnDelete:CASCADE;"`
}

// ToDTO map Feedback to dto.FeedbackDTO
func (feedback *Feedback) ToDTO() dto.FeedbackDTO {
	return dto.FeedbackDTO{
		Title:       feedback.Title,
		Description: feedback.Description,
		Article:     feedback.Article.ToDTO(),
	}
}

// ParseForm parse Feedback from dto.FeedbackInputForm
func (feedback *Feedback) ParseForm(form dto.FeedbackInputForm) {
	feedback.Title = form.Title
	feedback.Description = form.Description
}
