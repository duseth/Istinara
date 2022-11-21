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

// ListArticles get all articles records
func ListArticles(ctx *gin.Context) {
	var articles []models.Article
	if err := models.DB.Find(&articles).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": articles})
}

// GetArticle get article record
func GetArticle(ctx *gin.Context) {
	var article models.Article

	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&article).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": article})
}

// CreateArticle create new article record
func CreateArticle(ctx *gin.Context) {
	var article models.Article
	if err := ctx.Bind(&article); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pictureName := uuid.New().String() + filepath.Ext(file.Filename)
	picturePath := filepath.Join("/server", "assets", "pictures", "articles", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Unable to save the file"})
		return
	}

	article.PicturePath = picturePath
	if err = models.DB.Create(&article).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": article})
}

// UpdateArticle update article record
func UpdateArticle(ctx *gin.Context) {
	var article models.Article
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&article).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var input models.Article
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
		picturePath := filepath.Join("/server", "assets", "pictures", "articles", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		err = os.Remove(article.PicturePath)
		if err != nil {
			log.Println(err.Error())
		}
		input.PicturePath = picturePath
	}

	if err := models.DB.Model(&article).Updates(&input).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": article})
}

// DeleteArticle delete article record
func DeleteArticle(ctx *gin.Context) {
	var article models.Article
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&article).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	if err := models.DB.Delete(&article).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": true})
}
