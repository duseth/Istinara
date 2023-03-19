package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func GroupsPublic(router *gin.RouterGroup) {
	router.GET("/groups", controllers.ListGroups)
}

func GroupsPrivate(router *gin.RouterGroup) {
	router.POST("/groups", controllers.CreateGroup)
	router.PATCH("/groups/:id", controllers.UpdateGroup)
	router.DELETE("/groups/:id", controllers.DeleteGroup)
}
