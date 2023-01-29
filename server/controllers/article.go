package controllers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/mapper"
	"github.com/duseth/istinara/server/utils/translit"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListArticles   		godoc
//
//	@Summary		Get all articles
//	@Description	Returns list of all articles
//	@Tags			articles
//	@Produce		json
//	@Response		200	{object}	dto.ArticleListResult
//	@Failure		500	{object}	http.InternalServerErrorResponse
//	@Router			/articles [get]
func ListArticles(ctx *gin.Context) {
	var articles []models.Article
	if err := models.DB.Find(&articles).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapArticles(articles))
}

// GetArticle   		godoc
//
//	@Summary		Get article by ID
//	@Description	Returns a single article
//	@Tags			articles
//	@Produce		json
//	@Param			id	path		string	true	"Article ID"
//	@Response		200	{object}	dto.ArticleSingleResult
//	@Failure		400	{object}	http.BadRequestResponse
//	@Router			/articles/{id} [get]
func GetArticle(ctx *gin.Context) {
	var article models.Article

	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapArticle(article))
}

// CreateArticle   		godoc
//
//	@Summary	Add a new article
//	@Tags		articles
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		body	formData	dto.ArticleInputForm	true	"Article object that needs to be added"
//	@Param		file	formData	file					true	"Article image"
//	@Response	200		{object}	dto.ArticleSingleResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Failure	500		{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/articles/{id} [post]
func CreateArticle(ctx *gin.Context) {
	var articleForm dto.ArticleInputForm
	if err := ctx.Bind(&articleForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	pictureName := uuid.New().String() + filepath.Ext(file.Filename)
	picturePath := filepath.Join("/app", "public", "assets", "images", "articles", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	var article models.Article
	mapper.ParseArticle(articleForm, &article)
	article.PicturePath = picturePath
	article.Link = translit.GenerateLinkFromText(article.TitleRu)

	if err = models.DB.Create(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapArticle(article))
}

// UpdateArticle   		godoc
//
//	@Summary	Update existence article
//	@Tags		articles
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		id		path		string					true	"Article ID"
//	@Param		body	formData	dto.ArticleInputForm	true	"Article fields that needs to update"
//	@Param		file	formData	file					true	"Article image that needs update"
//	@Response	200		{object}	dto.ArticleSingleResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Failure	500		{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/articles/{id} [patch]
func UpdateArticle(ctx *gin.Context) {
	var article models.Article
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var articleForm dto.ArticleInputForm
	if err := ctx.Bind(&articleForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var picturePath string
	if _, received := ctx.Keys["file"]; received {
		file, err := ctx.FormFile("file")
		if err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
			return
		}

		pictureName := uuid.New().String() + filepath.Ext(file.Filename)
		picturePath = filepath.Join("/app", "public", "assets", "images", "articles", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}

		err = os.Remove(article.PicturePath)
		if err != nil {
			log.Println(err.Error())
		}
	}

	if err := models.DB.Model(&article).Updates(&articleForm).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	if err := models.DB.Model(&article).Update("picture_path", picturePath).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	if articleForm.TitleRu != "" {
		link := translit.GenerateLinkFromText(articleForm.TitleRu)
		if err := models.DB.Model(&article).Update("link", link).Error; err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}
	}

	httputil.ResponseSuccess(ctx, mapper.MapArticle(article))
}

// DeleteArticle   		godoc
//
//	@Summary	Delete existence article
//	@Tags		articles
//	@Produce	json
//	@Param		id	path		string	true	"Article ID"
//	@Response	200	{object}	http.SuccessResponse
//	@Failure	400	{object}	http.BadRequestResponse
//	@Failure	500	{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/articles/{id} [delete]
func DeleteArticle(ctx *gin.Context) {
	var article models.Article
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	if err := models.DB.Delete(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
