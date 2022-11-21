package main

import (
	"github.com/duseth/istinara/server/middlewares"
	"github.com/duseth/istinara/server/models"
	"github.com/duseth/istinara/server/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Global Middlewares
	router.Use(cors.Default())

	// Initialise Database
	models.DatabaseConnect()

	// Public API
	public := router.Group("/api")
	{
		routes.Auth(public)
		routes.ArticlesPublic(public)
		routes.AuthorPublic(public)
		routes.WorkPublic(public)
	}

	// Protected API
	private := router.Group("/api/private")
	{
		routes.Users(private)
		routes.ArticlesPrivate(private)
		routes.AuthorPrivate(private)
		routes.WorkPrivate(private)
	}
	private.Use(middlewares.JwtAuthMiddleware())

	err := router.Run()
	if err != nil {
		return
	}
}
