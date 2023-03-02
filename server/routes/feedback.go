package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func FeedbackPrivate(router *gin.RouterGroup) {
	router.GET("/feedback/:id", controllers.GetFeedback)
	router.GET("/feedback", controllers.ListFeedbacks)
	router.DELETE("/feedback", controllers.DeleteFeedback)
}
