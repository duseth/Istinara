package controllers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/token"
	"github.com/duseth/istinara/server/utils/translit"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
)

// ListArticles   		godoc
//
//	@Summary		Get all articles
//	@Description	Returns list of all articles
//	@Tags			articles
//	@Produce		json
//	@Param			offset	query		integer	false	"Count of skipped records"
//	@Param			limit	query		integer	false	"Limit for take in records"
//	@Response		200		{object}	dto.ArticleListResult
//	@Failure		500		{object}	http.InternalServerErrorResponse
//	@Router			/articles [get]
func ListArticles(ctx *gin.Context) {
	var count int64
	var articles []models.Article

	db := models.DB
	db.Model(&models.Article{}).Count(&count)

	if offset, err := strconv.Atoi(ctx.Query("offset")); err == nil {
		db = db.Offset(offset)
	}

	if limit, err := strconv.Atoi(ctx.Query("limit")); err == nil {
		db = db.Limit(limit)
	}

	err := db.Preload("Group").Find(&articles).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.ArticleDTO, 0, len(articles))
	for _, article := range articles {
		data = append(data, article.ToDTO())
	}

	if userId, err := token.ExtractTokenID(ctx); err == nil {
		var favourites []models.Favourite
		err = models.DB.Where("user_id = ?", userId.String()).Find(&favourites).Error
		if err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}

		for i := 0; i < len(data); i++ {
			for _, favourite := range favourites {
				if data[i].ID == favourite.ArticleID {
					data[i].IsLiked = true
				}
			}
		}
	}

	httputil.ResponseSuccess(ctx, gin.H{"data": data, "count": count})
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

	column := "id"
	if _, err := uuid.FromString(ctx.Param("id")); err != nil {
		column = "link"
	}

	db := models.DB.Preload("Group").Preload("Work").Preload("Work.Author")
	if err := db.Where(fmt.Sprint(column, " = ?"), ctx.Param("id")).First(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	data := article.ToDTO()

	group := article.Group.ToDTO()
	data.Group = &group

	work := article.Work.ToDTO()
	data.Work = &work

	author := article.Work.Author.ToDTO()
	data.Work.Author = &author

	var linked []uuid.UUID
	models.DB.Model(&models.ArticleLink{}).Select("link_id").Where("article_id = ?", data.ID).Find(&linked)

	if len(linked) > 0 {
		var linkedArticles []models.Article
		models.DB.Preload("Group").Find(&linkedArticles, linked)

		data.LinkedArticles = make([]dto.ArticleDTO, 0, len(linkedArticles))
		for _, linkArticle := range linkedArticles {
			data.LinkedArticles = append(data.LinkedArticles, linkArticle.ToDTO())
		}
	}

	if userId, err := token.ExtractTokenID(ctx); err == nil {
		var favourites []models.Favourite
		err = models.DB.Where("user_id = ?", userId.String()).Find(&favourites).Error
		if err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}

		for _, favourite := range favourites {
			if data.ID == favourite.ArticleID {
				data.IsLiked = true
			}
		}
	}

	httputil.ResponseSuccess(ctx, data)
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

	uid, err := uuid.NewV4()
	pictureName := uid.String() + filepath.Ext(file.Filename)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	picturePath := filepath.Join("/app", "public", "assets", "images", "articles", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	var article models.Article
	article.ParseForm(articleForm)
	article.PicturePath = picturePath
	article.Link = translit.GenerateLinkFromText(article.TitleRu)

	if err = models.DB.Create(&article).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, article.ToDTO())
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

		uid, err := uuid.NewV4()
		pictureName := uid.String() + filepath.Ext(file.Filename)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

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

	httputil.ResponseSuccess(ctx, article.ToDTO())
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
	if err := models.DB.Where("id = ?", ctx.Param("id")).Delete(&models.Article{}).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
