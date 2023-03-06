package main

import (
	"log"
	"os"
	"time"

	_ "github.com/duseth/istinara/server/docs"
	"github.com/duseth/istinara/server/middlewares"
	"github.com/duseth/istinara/server/models"
	"github.com/duseth/istinara/server/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/swaggo/files"
	"github.com/swaggo/gin-swagger"
)

//	@title			Istinara API
//	@version		1.0
//	@description	Open Dictionary of Culturally Marked Vocabulary of the Russian Language with Arabic Translation

//	@contact.name	Istinara
//	@contact.url	https://istinara.ru

//	@license.name	MIT License
//	@license.url	https://spdx.org/licenses/MIT.html

//	@host		istinara.ru
//	@BasePath	/api

//	@schemes	http https

// @securityDefinitions.apikey	token
// @in							header
// @name						Authorization
func main() {
	// Initialise database
	models.DatabaseConnect()

	// Run migrations for updating database state
	models.RunMigrations()

	// Loading initial database data from JSON file
	models.LoadInitialDump()

	// Initialise router
	router := gin.Default()

	// CORS Middleware
	corsConfig := cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"},
		MaxAge:           24 * time.Hour,
		AllowCredentials: true,
	}
	router.Use(cors.New(corsConfig))

	// Public API
	api := router.Group("/api")
	{
		// Initialise Swagger docs
		api.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

		// Authentication
		auth := api.Group("/auth")
		{
			routes.Auth(auth)
		}

		routes.AuthorPublic(api)
		routes.WorkPublic(api)
		routes.ArticlesPublic(api)
		routes.RequestPublic(api)

		// Protected API
		protected := api.Group("")
		{
			protected.Use(middlewares.JwtAuthMiddleware())

			// User API
			user := protected.Group("/user")
			{
				routes.User(user)
			}

			// Administration API
			private := protected.Group("")
			{
				// Private Middlewares
				private.Use(middlewares.DataManipulationMiddleware())

				routes.AuthorPrivate(private)
				routes.WorkPrivate(private)
				routes.ArticlesPrivate(private)
				routes.RequestPrivate(private)
				routes.FeedbackPrivate(private)
			}
		}
	}

	// Run server
	err := router.RunTLS(":"+os.Getenv("PORT"), os.Getenv("SSL_CERT"), os.Getenv("SSL_KEY"))
	if err != nil {
		log.Fatal(err.Error())
	}
}
