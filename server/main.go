package main

import (
	"log"

	"github.com/duseth/istinara/server/middlewares"
	"github.com/duseth/istinara/server/models"
	"github.com/duseth/istinara/server/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialise Database
	models.DatabaseConnect()

	// Public API
	router := gin.Default()
	api := router.Group("/api")
	{
		// Global Middlewares
		api.Use(cors.Default())

		routes.AuthorPublic(api)
		routes.WorkPublic(api)
		routes.ArticlesPublic(api)

		auth := api.Group("/auth")
		{
			routes.Auth(auth)
		}

		// Protected API
		private := api.Group("/api/private")
		{
			// Protected Middlewares
			private.Use(middlewares.JwtAuthMiddleware())

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
