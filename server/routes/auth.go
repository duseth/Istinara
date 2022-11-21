package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func Auth(router *gin.RouterGroup) {
	router.POST("/login", controllers.Login)
	router.POST("/register", controllers.Register)
}

func Users(router *gin.RouterGroup) {
	router.GET("/user", controllers.CurrentUser)
}
