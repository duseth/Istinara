package queries

import (
	"fmt"

	"gorm.io/gorm"
)

func SearchArticles(db *gorm.DB, value string, properties ...string) *gorm.DB {
	for _, property := range properties {
		db.Or(fmt.Sprintf("%s ILIKE '%%%s%%'", property, value))
	}

	return db
}
