package main

import (
	"log"
	"os"
	"time"

	storage "github.com/duseth/istinara/api/internal/adapter/db/postgres"
	http "github.com/duseth/istinara/api/internal/controller/http/handlers"
	"github.com/duseth/istinara/api/internal/controller/http/handlers/general"
	"github.com/duseth/istinara/api/internal/controller/http/handlers/web"
	"github.com/duseth/istinara/api/internal/usecase"
	"github.com/duseth/istinara/api/migrations"
	"github.com/duseth/istinara/api/pkg/client/postgres"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	var db, err = postgres.NewClient()
	if err != nil {
		log.Fatal("Failed to connect to database!\n", err)
	}

	// Run migrations
	migrations.RunMigrations(db)

	// Initialize HTTP server engine
	engine := gin.New()
	engine.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"},
		MaxAge:           24 * time.Hour,
		AllowCredentials: true,
	}))

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

	router := engine.Group("/api")

	// Register general API
	general.Register(router, []http.IHandler{
		general.NewAuthHandler(userUsecase),
		general.NewArticleTypeHandler(articleTypeUsecase),
		general.NewAuthorHandler(authorUsecase, workUsecase),
		general.NewArticleHandler(articleUsecase),
		general.NewWorkHandler(workUsecase, articleUsecase),
	})

	// Register web-specific API
	web.Register(router, []http.IHandler{
		web.NewUserHandler(userUsecase),
		web.NewArticleTypeHandler(articleTypeUsecase),
		web.NewAuthorHandler(authorUsecase, workUsecase),
		web.NewArticleHandler(articleUsecase),
		web.NewFeedbackHandler(feedbackUsecase),
		web.NewContributionHandler(contributionUsecase),
		web.NewWorkHandler(workUsecase, articleUsecase),
		web.NewStatisticsHandler(statisticsUsecase),
	})

	// Run HTTP server
	err = engine.RunTLS(":"+os.Getenv("PORT"), os.Getenv("SSL_CERT"), os.Getenv("SSL_KEY"))
	if err != nil {
		log.Fatal(err.Error())
	}
}
