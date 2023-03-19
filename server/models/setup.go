package models

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func DatabaseConnect() {
	connectionString := os.Getenv("CONNECTION_STRING")

	database, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database!\n", err)
	}
	DB = database
}

func RunMigrations() {
	err := DB.AutoMigrate(
		&User{}, &Author{}, &Work{}, &Article{}, &Contribution{}, &Group{}, &Favourite{}, &ArticleLink{}, &Feedback{},
	)
	if err != nil {
		log.Fatal("Error while running migrations!\n", err)
	}
}
