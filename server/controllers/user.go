package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func EditUser(ctx *gin.Context) {
	var user models.User
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&user).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var input dto.EditUserForm
	if err := ctx.Bind(&input); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	updateUser := models.User{Username: input.Username, Email: input.Email}
	if err := models.DB.Model(&user).Updates(updateUser).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, user.ToDTO())
}

func ChangePassword(ctx *gin.Context) {
	var input dto.ChangePasswordForm
	if err := ctx.Bind(&input); err != nil || input.NewPassword != input.AcceptNewPassword {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var user models.User
	if err := models.DB.Where("email = ?", input.Email).Take(&user).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.CurrentPassword))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}
	user.Password = string(hash)

	if err = models.DB.Model(&user).Updates(user).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
