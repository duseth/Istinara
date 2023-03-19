package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/gin-gonic/gin"
)

func ListContributions(ctx *gin.Context) {
	var requests []models.Contribution
	if err := models.DB.Preload("Work").Find(&requests).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.ContributionDTO, 0, len(requests))
	for _, request := range requests {
		data = append(data, request.ToDTO())
	}

	httputil.ResponseSuccess(ctx, data)
}

func GetContribution(ctx *gin.Context) {
	var request models.Contribution

	err := models.DB.Preload("Work").Where("id = ?", ctx.Param("id")).First(&request).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, request.ToDTO())
}

func CreateContribution(ctx *gin.Context) {
	var requestForm dto.ContributionDTO
	if err := ctx.Bind(&requestForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var request models.Contribution
	request.ParseForm(requestForm)

	if err := models.DB.Create(&request).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}

func DeleteContribution(ctx *gin.Context) {
	var request models.Contribution
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
