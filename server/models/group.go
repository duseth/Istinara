package models

import (
	"github.com/duseth/istinara/server/dto"
)

type Group struct {
	Base

	NameRu string `gorm:"column:name_ru" json:"name_ru"`
	NameAr string `gorm:"column:name_ar" json:"name_ar"`

	ShortNameRu string `gorm:"column:short_name_ru" json:"short_name_ru"`
	ShortNameAr string `gorm:"column:short_name_ar" json:"short_name_ar"`
}

// ToDTO map Group to dto.GroupDTO
func (group *Group) ToDTO() dto.GroupDTO {
	return dto.GroupDTO{
		ID:          group.ID,
		NameRu:      group.NameRu,
		NameAr:      group.NameAr,
		ShortNameRu: group.ShortNameRu,
		ShortNameAr: group.ShortNameAr,
	}
}
