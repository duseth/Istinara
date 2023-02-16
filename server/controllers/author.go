package controllers

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/duseth/istinara/server/utils/mapper"
	"github.com/duseth/istinara/server/utils/translit"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListAuthors   		godoc
//
//	@Summary		Get all authors
//	@Description	Returns list of all authors
//	@Tags			authors
//	@Produce		json
//	@Param			offset	query		integer	false	"Count of skipped records"
//	@Param			limit	query		integer	false	"Limit for take in records"
//	@Response		200		{object}	dto.AuthorListResult
//	@Failure		500		{object}	http.InternalServerErrorResponse
//	@Router			/authors [get]
func ListAuthors(ctx *gin.Context) {
	var count int64
	var authors []models.Author

	db := models.DB
	db.Model(&models.Author{}).Count(&count)

	if offset, err := strconv.Atoi(ctx.Query("offset")); err == nil {
		db = db.Offset(offset)
	}

	if limit, err := strconv.Atoi(ctx.Query("limit")); err == nil {
		db = db.Limit(limit)
	}

	if err := db.Find(&authors).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, gin.H{"data": mapper.MapAuthors(authors), "count": count})
}

// GetAuthor   		godoc
//
//	@Summary		Get author by ID
//	@Description	Returns a single author
//	@Tags			authors
//	@Produce		json
//	@Param			id	path		string	true	"Author ID"
//	@Response		200	{object}	dto.AuthorSingleResult
//	@Failure		400	{object}	http.BadRequestResponse
//	@Router			/authors/{id} [get]
func GetAuthor(ctx *gin.Context) {
	var author models.Author

	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&author).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapAuthor(author))
}

// GetWorksByAuthor   		godoc
//
//	@Summary		Get all works by author ID
//	@Description	Returns list of all works
//	@Tags			authors
//	@Produce		json
//	@Param			id	path		string	true	"Author ID"
//	@Response		200	{object}	dto.WorkListResult
//	@Failure		400	{object}	http.BadRequestResponse
//	@Router			/authors/{id}/works [get]
func GetWorksByAuthor(ctx *gin.Context) {
	var works []models.Work

	if err := models.DB.Preload("Author").Where("author_id = ?", ctx.Param("id")).Find(&works).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapWorks(works))
}

// CreateAuthor   		godoc
//
//	@Summary	Add a new author
//	@Tags		authors
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		body	formData	dto.AuthorInputForm	true	"Author object that needs to be added"
//	@Param		file	formData	file				true	"Author image"
//	@Response	200		{object}	dto.AuthorSingleResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Failure	500		{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/authors/{id} [post]
func CreateAuthor(ctx *gin.Context) {
	var authorForm dto.AuthorInputForm
	if err := ctx.Bind(&authorForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	pictureName := uuid.New().String() + filepath.Ext(file.Filename)
	picturePath := filepath.Join("/app", "public", "assets", "images", "authors", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	var author models.Author
	mapper.ParseAuthor(authorForm, &author)
	author.PicturePath = picturePath
	author.Link = translit.GenerateLinkFromText(author.NameRu)

	if err = models.DB.Create(&author).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapAuthor(author))
}

// UpdateAuthor   		godoc
//
//	@Summary	Update existence author
//	@Tags		authors
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		id		path		string				true	"Author ID"
//	@Param		body	formData	dto.AuthorInputForm	true	"Author fields that needs to update"
//	@Param		file	formData	file				true	"Author image that needs update"
//	@Response	200		{object}	dto.AuthorSingleResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Failure	500		{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/authors/{id} [patch]
func UpdateAuthor(ctx *gin.Context) {
	var author models.Author
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&author).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	var authorForm dto.AuthorInputForm
	if err := ctx.Bind(&authorForm); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var picturePath string
	if _, received := ctx.Keys["file"]; received {
		file, err := ctx.FormFile("file")
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		pictureName := uuid.New().String() + filepath.Ext(file.Filename)
		picturePath = filepath.Join("/server", "assets", "pictures", "authors", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		err = os.Remove(author.PicturePath)
		if err != nil {
			log.Println(err.Error())
		}
	}

	if err := models.DB.Model(&author).Updates(&authorForm).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Model(&author).Update("picture_path", picturePath).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	if authorForm.NameRu != "" {
		link := translit.GenerateLinkFromText(authorForm.NameRu)
		if err := models.DB.Model(&author).Update("link", link).Error; err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}
	}

	httputil.ResponseSuccess(ctx, mapper.MapAuthor(author))
}

// DeleteAuthor   		godoc
//
//	@Summary	Delete existence author
//	@Tags		authors
//	@Produce	json
//	@Param		id	path		string	true	"Author ID"
//	@Response	200	{object}	http.SuccessResponse
//	@Failure	400	{object}	http.BadRequestResponse
//	@Failure	500	{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/authors/{id} [delete]
func DeleteAuthor(ctx *gin.Context) {
	var author models.Author
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&author).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	if err := models.DB.Delete(&author).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
