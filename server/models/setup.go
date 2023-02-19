package models

import (
	"encoding/json"
	"log"
	"os"
	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func DatabaseConnect() {
	connectionString := os.Getenv("CONNECTION_STRING")

	// Initialising database connection
	database, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database!\n", err)
	}
	DB = database

	// Run migrations
	err = DB.AutoMigrate(&User{}, &Author{}, &Work{}, &Article{}, &Request{}, &Group{}, &Favourite{})
	if err != nil {
		return
	}

	// Load dump file
	if isLoad, err := strconv.ParseBool(os.Getenv("LOAD_DUMP")); err == nil && isLoad {
		LoadInitialDump()
	}
}

func LoadInitialDump() {
	dumpName := os.Getenv("DUMP_FILE_NAME")

	loadEntities := LoadEntities{}
	file, err := os.ReadFile(dumpName)
	if err != nil {
		log.Printf("The file \"%s\" was not uploaded, recordings could not be uploaded\n%s", dumpName, err.Error())
		return
	}

	err = json.Unmarshal(file, &loadEntities)
	if err != nil {
		log.Printf("JSON from file \"%s\" cannot properly deserialize\n%s", dumpName, err.Error())
		return
	}

	DB.Create(&loadEntities.Authors)
	DB.Create(&loadEntities.Works)
	DB.Create(&loadEntities.Groups)
	DB.Create(&loadEntities.Articles)
}

type LoadEntities struct {
	Authors  []Author  `json:"authors"`
	Works    []Work    `json:"works"`
	Groups   []Group   `json:"groups"`
	Articles []Article `json:"articles"`
}
