package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func ArticlesPublic(router *gin.RouterGroup) {
	router.GET("/articles", controllers.ListArticles)
	router.GET("/groups", controllers.ListGroups)
	router.GET("/articles/:id", controllers.GetArticle)
	router.GET("/articles/:id/links", controllers.ListLinked)
	router.POST("/articles/:id/feedback", controllers.CreateFeedback)
}

func ArticlesPrivate(router *gin.RouterGroup) {
	router.POST("/articles", controllers.CreateArticle)
	router.POST("/articles/:id/link/:link_id", controllers.CreateLink)
	router.DELETE("/articles/:id/link/:link_id", controllers.DeleteLink)
	router.PATCH("/articles/:id", controllers.UpdateArticle)
	router.DELETE("/articles/:id", controllers.DeleteArticle)
}
