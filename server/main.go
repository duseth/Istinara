package main

import (
	"log"

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
//	@contact.email	istinara@site.ru

//	@license.name	MIT License
//	@license.url	https://spdx.org/licenses/MIT.html

//	@host		localhost:8080
//	@BasePath	/api

//	@schemes	http https

// @securityDefinitions.apikey	token
// @in							header
// @name						Authorization
func main() {
	// Initialise database
	models.DatabaseConnect()

	// Initialise router
	router := gin.Default()

	// Public API
	api := router.Group("/api")
	{
		// Initialise Swagger docs
		api.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

		// Global Middlewares
		api.Use(cors.Default())

		// Authentication
		auth := api.Group("/auth")
		{
			routes.Auth(auth)
		}

		routes.AuthorPublic(api)
		routes.WorkPublic(api)
		routes.ArticlesPublic(api)

		// User API
		user := api.Group("/user")
		{
			// Protected Middlewares
			user.Use(middlewares.JwtAuthMiddleware())

			// TODO: user defined routes (e.g. favourites articles)
		}

		// Administration API
		private := api.Group("/private")
		{
			// Private Middlewares
			private.Use(middlewares.DataManipulationMiddleware())

			routes.AuthorPrivate(private)
			routes.WorkPrivate(private)
			routes.ArticlesPrivate(private)
		}
	}

	// Run server
	err := router.Run()
	if err != nil {
		log.Fatal(err.Error())
	}
}
