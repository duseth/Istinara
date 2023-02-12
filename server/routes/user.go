package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func User(router *gin.RouterGroup) {
	router.POST("/edit/:id", controllers.EditUser)
	router.POST("/change_password/:id", controllers.ChangePassword)
}
