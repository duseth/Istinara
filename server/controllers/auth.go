package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/mapper"
	"github.com/duseth/istinara/server/utils/token"
	"github.com/gin-gonic/gin"
)

// Login   		godoc
//
//	@Summary	Get JWT token for authorization requests
//	@Tags		account
//	@Produce	json
//	@Param		body	formData	dto.LoginInputForm	true	"User credentials for login"
//	@Response	200		{object}	dto.LoginResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Router		/account/login [post]
func Login(ctx *gin.Context) {
	var input dto.LoginInputForm

	if err := ctx.Bind(&input); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var user models.User
	accessToken, err := token.GetAuthorizationToken(&user, input.Email, input.Password)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, gin.H{"user": mapper.MapUser(user), "token": accessToken})
}

// Register   		godoc
//
//	@Summary	Registration new user in the system
//	@Tags		account
//	@Produce	json
//	@Param		body	formData	dto.RegisterInputForm	true	"User credentials for register"
//	@Response	200		{object}	http.SuccessResponse
//	@Failure	400		{object}	http.BadRequestResponse
//	@Router		/account/register [post]
func Register(ctx *gin.Context) {
	var userForm dto.RegisterInputForm

	if err := ctx.Bind(&userForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var user models.User
	mapper.ParseUser(userForm, &user)

	if err := models.DB.Create(&user).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
