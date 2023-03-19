package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func ContributionPublic(router *gin.RouterGroup) {
	router.POST("/contribution", controllers.CreateContribution)
}

func ContributionPrivate(router *gin.RouterGroup) {
	router.GET("/contribution/:id", controllers.GetContribution)
	router.GET("/contribution", controllers.ListContributions)
	router.DELETE("/contribution", controllers.DeleteContribution)
}
