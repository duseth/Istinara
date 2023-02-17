package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/gin-gonic/gin"
)

func ListRequests(ctx *gin.Context) {
	var requests []models.Request
	if err := models.DB.Preload("Author").Preload("Work").Find(&requests).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.RequestDTO, 0, len(requests))
	for _, request := range requests {
		data = append(data, request.ToDTO())
	}

	httputil.ResponseSuccess(ctx, data)
}

func GetRequest(ctx *gin.Context) {
	var request models.Request

	err := models.DB.Preload("Author").Preload("Work").Where("id = ?", ctx.Param("id")).First(&request).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, request.ToDTO())
}

func CreateRequest(ctx *gin.Context) {
	var requestForm dto.RequestInputForm
	if err := ctx.Bind(&requestForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var request models.Request
	request.ParseForm(requestForm)

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
