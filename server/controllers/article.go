package controllers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/queries"
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
//	@Param			query	query		string	false	"Search query"
//	@Param			sort_by	query		string	false	"Sorting parameters (column.direction, column.direction)"
//	@Param			offset	query		integer	false	"Count of skipped records"
//	@Param			limit	query		integer	false	"Limit for take in records"
//	@Response		200		{object}	dto.ArticleListResult
//	@Failure		500		{object}	http.InternalServerErrorResponse
//	@Router			/articles [get]
func ListArticles(ctx *gin.Context) {
	var count int64
	var articles []models.Article

	db := models.DB.Model(&models.Article{})

	if ctx.Query("query") != "" {
		properties := []string{"title_ru", "title_ar", "quote_ru", "quote_ar", "description_ru", "description_ar"}
		queries.SearchArticles(db, ctx.Query("query"), properties...)
	}

	db.Count(&count)

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

func ListLinked(ctx *gin.Context) {
	var count int64
	var articleLinks []models.ArticleLink

	db := models.DB.Model(&models.ArticleLink{}).Where("article_id = ?", ctx.Param("id"))
	db.Count(&count)

	err := db.Preload("Link").Preload("Link.Group").Find(&articleLinks).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.ArticleDTO, 0, len(articleLinks))
	for _, link := range articleLinks {
		data = append(data, link.Link.ToDTO())
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
	data.Work = article.Work.ToDTO()
	data.Group = article.Group.ToDTO()

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

func CreateLink(ctx *gin.Context) {
	link := models.ArticleLink{
		ArticleID: ctx.Param("id"),
		LinkID:    ctx.Param("link_id"),
	}

	if err := models.DB.Create(&link).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, link)
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
	var articleForm dto.ArticleDTO
	if err := ctx.Bind(&articleForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var article models.Article
	article.ParseForm(articleForm)
	article.Link = translit.GenerateLinkFromText(article.TitleRu)

	file, err := ctx.FormFile("picture")
	if err == nil {
		rootPath, err := filepath.Abs("./main.exe")
		rootPath = filepath.Dir(rootPath)

		pictureName := article.Link + filepath.Ext(file.Filename)

		picturePath := filepath.Join(rootPath, "app", "public", "images", "articles", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}
		article.PicturePath = filepath.Join("/images", "articles", pictureName)
	}

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
	if err := models.DB.Where("id = ?", ctx.Param("id")).Find(&article).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var articleForm dto.ArticleDTO
	if err := ctx.Bind(&articleForm); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if articleForm.TitleRu != "" {
		articleForm.Link = translit.GenerateLinkFromText(articleForm.TitleRu)
	}

	if file, err := ctx.FormFile("picture"); err == nil {
		rootPath, err := filepath.Abs("./main.exe")
		rootPath = filepath.Dir(rootPath)

		var pictureName string
		if articleForm.Link != "" {
			pictureName = articleForm.Link + filepath.Ext(file.Filename)
		} else {
			pictureName = article.Link + filepath.Ext(file.Filename)
		}

		picturePath := filepath.Join(rootPath, "app", "public", "images", "articles", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}
		articleForm.PicturePath = filepath.Join("/images", "articles", pictureName)
	}

	var updateArticle models.Article
	updateArticle.ParseForm(articleForm)
	if err := models.DB.Model(&article).Updates(updateArticle).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
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

func DeleteLink(ctx *gin.Context) {
	db := models.DB.Where("article_id = ? AND link_id = ?", ctx.Param("id"), ctx.Param("link_id"))
	if err := db.Delete(&models.ArticleLink{}).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
