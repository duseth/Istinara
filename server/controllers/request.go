package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/mapper"
	"github.com/gin-gonic/gin"
)

func GetRequest(ctx *gin.Context) {
	var request models.Request

	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&request).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapRequest(request))
}

func ListRequests(ctx *gin.Context) {
	var requests []models.Request
	if err := models.DB.Find(&requests).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapRequests(requests))
}

func CreateRequest(ctx *gin.Context) {
	var requestForm dto.RequestInputForm
	if err := ctx.Bind(&requestForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var request models.Request
	mapper.ParseRequest(requestForm, &request)

	if err := models.DB.Create(&request).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}

func DeleteRequest(ctx *gin.Context) {
	var request models.Request
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&request).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	if err := models.DB.Delete(&request).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
