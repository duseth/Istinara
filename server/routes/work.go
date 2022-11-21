package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func WorkPublic(router *gin.RouterGroup) {
	router.GET("/works", controllers.ListWorks)
	router.GET("/works/:id", controllers.GetWork)
	router.GET("/works/:id/articles", controllers.GetArticlesByWork)
}

func WorkPrivate(router *gin.RouterGroup) {
	router.POST("/works", controllers.CreateWork)
	router.PATCH("/works/:id", controllers.UpdateWork)
	router.DELETE("/works/:id", controllers.DeleteWork)
}
