package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func ArticlesPublic(router *gin.RouterGroup) {
	router.GET("/articles", controllers.ListArticles)
	router.GET("/articles/:id", controllers.GetArticle)
	router.POST("/articles/:id/feedback", controllers.CreateFeedback)
}

func ArticlesPrivate(router *gin.RouterGroup) {
	router.POST("/articles", controllers.CreateArticle)
	router.PATCH("/articles/:id", controllers.UpdateArticle)
	router.DELETE("/articles/:id", controllers.DeleteArticle)
}
