package main

import (
	"log"
	"os"

	"github.com/duseth/istinara/api/internal/adapter/db/postgres"
	"github.com/duseth/istinara/api/internal/controller/http"
	"github.com/duseth/istinara/api/internal/controller/http/v1"
	"github.com/duseth/istinara/api/internal/usecase"
	"github.com/duseth/istinara/api/migrations"
	"github.com/duseth/istinara/api/pkg/client/postgres"
)

//	@title			Istinara API
//	@version		1.0
//	@description	Open online dictionary of culturally marked vocabulary of the Russian language with translation into Arabic Language

//	@contact.name	Istinara
//	@contact.url	https://istinara.ru

//	@license.name	MIT License
//	@license.url	https://spdx.org/licenses/MIT.html

//	@host		istinara.ru
//	@BasePath	/api

//	@schemes	https

// @securityDefinitions.apikey	token
// @in							header
// @name						Authorization
func main() {
	var db, err = postgres.NewClient()
	if err != nil {
		log.Fatal("Failed to connect to database!\n", err)
	}

	// Run migrations
	migrations.RunMigrations(db)

	// Storages
	userStorage := storage.NewUserStorage(db)
	workStorage := storage.NewWorkStorage(db)
	articleTypeStorage := storage.NewArticleTypeStorage(db)
	authorStorage := storage.NewAuthorStorage(db)
	articleStorage := storage.NewArticleStorage(db)
	feedbackStorage := storage.NewFeedbackStorage(db)
	favouritesStorage := storage.NewFavouriteStorage(db)
	contributionStorage := storage.NewContributionStorage(db)
	statisticsStorage := storage.NewStatisticsStorage(db)

	// Use cases
	workUsecase := usecase.NewWorkUsecase(workStorage)
	articleTypeUsecase := usecase.NewArticleTypeUsecase(articleTypeStorage)
	authorUsecase := usecase.NewAuthorUsecase(authorStorage)
	feedbackUsecase := usecase.NewFeedbackUsecase(feedbackStorage)
	userUsecase := usecase.NewUserUsecase(userStorage, favouritesStorage)
	contributionUsecase := usecase.NewContributionUsecase(contributionStorage)
	articleUsecase := usecase.NewArticleUsecase(articleStorage, favouritesStorage)
	statisticsUsecase := usecase.NewStatisticsUsecase(statisticsStorage)

	// Registration handlers and get HTTP server engine
	engine := http.NewRouter([]http.IHandler{
		v1.NewAuthHandler(userUsecase),
		v1.NewUserHandler(userUsecase),
		v1.NewArticleTypeHandler(articleTypeUsecase),
		v1.NewAuthorHandler(authorUsecase, workUsecase),
		v1.NewArticleHandler(articleUsecase),
		v1.NewFeedbackHandler(feedbackUsecase),
		v1.NewContributionHandler(contributionUsecase),
		v1.NewWorkHandler(workUsecase, articleUsecase),
		v1.NewStatisticsHandler(statisticsUsecase),
	})

	// Run HTTP server
	err = engine.RunTLS(":"+os.Getenv("PORT"), os.Getenv("SSL_CERT"), os.Getenv("SSL_KEY"))
	if err != nil {
		log.Fatal(err.Error())
	}
}
