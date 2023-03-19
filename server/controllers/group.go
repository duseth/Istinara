package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/gin-gonic/gin"
)

func ListGroups(ctx *gin.Context) {
	var count int64
	var groups []models.Group

	db := models.DB.Model(&models.Group{})
	db.Count(&count)

	err := db.Find(&groups).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.GroupDTO, 0, len(groups))
	for _, group := range groups {
		data = append(data, group.ToDTO())
	}

	httputil.ResponseSuccess(ctx, gin.H{"data": data, "count": count})
}

func CreateGroup(ctx *gin.Context) {
	var groupForm dto.GroupDTO
	if err := ctx.Bind(&groupForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var group models.Group
	group.ParseForm(groupForm)

	if err := models.DB.Create(&group).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, group.ToDTO())
}

func UpdateGroup(ctx *gin.Context) {
	var group models.Group
	if err := models.DB.Where("id = ?", ctx.Param("id")).Find(&group).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var groupForm dto.GroupDTO
	if err := ctx.Bind(&groupForm); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Model(&group).Updates(groupForm).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	httputil.ResponseSuccess(ctx, group.ToDTO())
}

func DeleteGroup(ctx *gin.Context) {
	if err := models.DB.Where("id = ?", ctx.Param("id")).Delete(&models.Group{}).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
