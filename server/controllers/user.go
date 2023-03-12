package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/token"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func EditUser(ctx *gin.Context) {
	userId, err := token.ExtractTokenID(ctx)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var user models.User
	if err = models.DB.Where("id = ?", userId.String()).First(&user).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var input dto.EditUserForm
	if err = ctx.Bind(&input); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	updateUser := models.User{Username: input.Username, Email: input.Email}
	if err = models.DB.Model(&user).Updates(updateUser).Error; err != nil {
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

	userId, err := token.ExtractTokenID(ctx)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var user models.User
	if err = models.DB.Where("id = ?", userId).Take(&user).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.CurrentPassword))
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

func ListFavourite(ctx *gin.Context) {
	var count int64
	var favourites []models.Favourite

	db := models.DB.Model(&models.Favourite{})

	if offset, err := strconv.Atoi(ctx.Query("offset")); err == nil {
		db = db.Offset(offset)
	}

	if limit, err := strconv.Atoi(ctx.Query("limit")); err == nil {
		db = db.Limit(limit)
	}

	if ctx.Query("sort_by") != "" {
		sort := strings.ReplaceAll(ctx.Query("sort_by"), ".", " ")
		db = db.Order(sort)
	}

	userId, err := token.ExtractTokenID(ctx)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	err = db.Preload("Article.Group").Where("user_id = ?", userId).Find(&favourites).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.ArticleDTO, 0, len(favourites))
	for _, favourite := range favourites {
		articleDTO := favourite.Article.ToDTO()
		articleDTO.IsLiked = true
		data = append(data, articleDTO)
	}

	httputil.ResponseSuccess(ctx, gin.H{"data": data, "count": count})
}

func CreateFavourite(ctx *gin.Context) {
	userId, err := token.ExtractTokenID(ctx)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	articleID, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	favourite := models.Favourite{
		UserID:    userId,
		ArticleID: articleID,
	}

	if err = models.DB.Create(&favourite).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}

func DeleteFavourite(ctx *gin.Context) {
	userId, err := token.ExtractTokenID(ctx)
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	err = models.DB.Where("user_id = ? AND article_id = ?", userId.String(), ctx.Param("id")).Delete(&models.Favourite{}).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
