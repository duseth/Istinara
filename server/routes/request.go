package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func RequestPublic(router *gin.RouterGroup) {
	router.POST("/requests", controllers.CreateRequest)
}

func RequestPrivate(router *gin.RouterGroup) {
	router.GET("/requests/:id", controllers.GetRequest)
	router.GET("/requests", controllers.ListRequests)
	router.DELETE("/requests", controllers.DeleteRequest)
}
