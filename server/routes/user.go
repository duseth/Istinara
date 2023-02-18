package routes

import (
	"github.com/duseth/istinara/server/controllers"
	"github.com/gin-gonic/gin"
)

func User(router *gin.RouterGroup) {
	router.GET("/favourites", controllers.ListFavourite)
	router.POST("/favourite/:id", controllers.CreateFavourite)
	router.DELETE("/favourite/:id", controllers.DeleteFavourite)

	router.POST("/edit", controllers.EditUser)
	router.POST("/change_password", controllers.ChangePassword)
}
