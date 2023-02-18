package dto

import (
	"github.com/gofrs/uuid"
)

type GroupDTO struct {
	ID uuid.UUID `json:"id"`

	NameRu string `json:"name_ru"`
	NameAr string `json:"name_ar"`

	ShortNameRu string `json:"short_name_ru"`
	ShortNameAr string `json:"short_name_ar"`
}
