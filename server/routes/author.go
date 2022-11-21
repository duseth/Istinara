package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func AuthorPublic(router *gin.RouterGroup) {
	router.GET("/authors", controllers.ListAuthors)
	router.GET("/authors/:id", controllers.GetAuthor)
	router.GET("/authors/:id/works", controllers.GetWorksByAuthor)
}

func AuthorPrivate(router *gin.RouterGroup) {
	router.POST("/authors", controllers.CreateAuthor)
	router.PATCH("/authors/:id", controllers.UpdateAuthor)
	router.DELETE("/authors/:id", controllers.DeleteAuthor)
}
