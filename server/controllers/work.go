package controllers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/duseth/istinara/server/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListWorks get all works records
func ListWorks(ctx *gin.Context) {
	var works []models.Work
	if err := models.DB.Find(&works).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": works})
}

// GetWork get work record
func GetWork(ctx *gin.Context) {
	var work models.Work

	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&work).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": work})
}

// GetArticlesByWork get articles records by work
func GetArticlesByWork(ctx *gin.Context) {
	var articles []models.Article

	if err := models.DB.Where("work_id = ?", ctx.Param("id")).Find(&articles).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": articles})
}

// CreateWork create new work record
func CreateWork(ctx *gin.Context) {
	var work models.Work
	if err := ctx.Bind(&work); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pictureName := uuid.New().String() + filepath.Ext(file.Filename)
	picturePath := filepath.Join("/server", "assets", "pictures", "works", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	work.PicturePath = picturePath
	if err = models.DB.Create(&work).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": work})
}

// UpdateWork update work record
func UpdateWork(ctx *gin.Context) {
	var work models.Work
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&work).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var input models.Work
	if err := ctx.Bind(&input); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, received := ctx.Keys["file"]; received {
		file, err := ctx.FormFile("file")
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		pictureName := uuid.New().String() + filepath.Ext(file.Filename)
		picturePath := filepath.Join("/server", "assets", "pictures", "works", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		err = os.Remove(work.PicturePath)
		if err != nil {
			log.Println(err.Error())
		}
		input.PicturePath = picturePath
	}

	if err := models.DB.Model(&work).Updates(&input).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": work})
}

// DeleteWork delete a work record
func DeleteWork(ctx *gin.Context) {
	var work models.Work
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&work).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	if err := models.DB.Delete(&work).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": true})
}
