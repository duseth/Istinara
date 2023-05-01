package migrations

import (
	"log"

	"github.com/duseth/istinara/api/internal/domain/model"
	"gorm.io/gorm"
)

func RunMigrations(db *gorm.DB) {
	err := db.AutoMigrate(
		&model.Author{}, &model.Work{}, &model.Article{}, &model.Feedback{}, &model.Contribution{},
		&model.ArticleLink{}, &model.Favourite{}, &model.ArticleType{}, &model.User{},
	)
	if err != nil {
		log.Fatal("Error while running migrations!\n", err)
	}
}
