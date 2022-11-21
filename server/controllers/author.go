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

// ListAuthors get all authors records
func ListAuthors(ctx *gin.Context) {
	var authors []models.Author
	if err := models.DB.Model(&models.Author{}).Preload("Works").Find(&authors).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": authors})
}

// GetAuthor get author record
func GetAuthor(ctx *gin.Context) {
	var author models.Author

	if err := models.DB.Model(&models.Author{}).Preload("Works").Where("id = ?", ctx.Param("id")).First(&author).Error; err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": author})
}

// GetWorksByAuthor get works records by author
func GetWorksByAuthor(ctx *gin.Context) {
	var works []models.Work

	if err := models.DB.Where("author_id = ?", ctx.Param("id")).Find(&works).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": works})
}

// CreateAuthor create new author record
func CreateAuthor(ctx *gin.Context) {
	var author models.Author
	if err := ctx.Bind(&author); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	pictureName := uuid.New().String() + filepath.Ext(file.Filename)
	picturePath := filepath.Join("/server", "assets", "pictures", "authors", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	author.PicturePath = picturePath
	if err = models.DB.Create(&author).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": author})
}

// UpdateAuthor update author record
func UpdateAuthor(ctx *gin.Context) {
	var author models.Author
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&author).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	var input models.Author
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
		picturePath := filepath.Join("/server", "assets", "pictures", "authors", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		err = os.Remove(author.PicturePath)
		if err != nil {
			log.Println(err.Error())
		}
		input.PicturePath = picturePath
	}

	if err := models.DB.Model(&author).Updates(&input).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": author})
}

// DeleteAuthor delete author record
func DeleteAuthor(ctx *gin.Context) {
	var author models.Author
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&author).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	if err := models.DB.Delete(&author).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": true})
}
