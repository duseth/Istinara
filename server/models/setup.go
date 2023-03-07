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

type LoadEntities struct {
	Authors  []Author  `json:"authors"`
	Works    []Work    `json:"works"`
	Groups   []Group   `json:"groups"`
	Articles []Article `json:"articles"`
}

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
		&User{}, &Author{}, &Work{}, &Article{}, &Request{}, &Group{}, &Favourite{}, &ArticleLink{}, &Feedback{},
	)
	if err != nil {
		log.Fatal("Error while running migrations!\n", err)
	}
}

func LoadInitialDump() {
	if isLoad, err := strconv.ParseBool(os.Getenv("IS_LOAD_DUMP")); err != nil || !isLoad {
		return
	}

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
