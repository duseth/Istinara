package models

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DatabaseConnect() {
	connectionString := os.Getenv("CONNECTION_STRING")

	// Initialising database connection
	database, err := gorm.Open(postgres.Open(connectionString))
	if err != nil {
		log.Fatal("Failed to connect to database!", err)
	}
	DB = database

	// Run migrations
	err = DB.AutoMigrate(
		&User{},
		&Author{},
		&Work{},
		&Article{},
	)
	if err != nil {
		return
	}
}
