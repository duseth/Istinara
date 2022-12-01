package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/models"
	"github.com/duseth/istinara/server/utils/token"
	"github.com/gin-gonic/gin"
)

func GetCurrentUser(ctx *gin.Context) {
	userUUID, err := token.ExtractTokenID(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := models.GetUserByID(userUUID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": user})
}

func Login(ctx *gin.Context) {
	var input models.User

	if err := ctx.Bind(&input); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	accessToken, err := token.GetAuthorizationToken(&user, input.Email, input.Password)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "username or password is incorrect."})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": user, "token": accessToken})
}

func Register(ctx *gin.Context) {
	var user models.User

	if err := ctx.Bind(&user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&user).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "registration success"})
}
