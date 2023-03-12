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
	"github.com/duseth/istinara/server/utils/translit"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
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

	if ctx.Query("sort_by") != "" {
		sort := strings.ReplaceAll(ctx.Query("sort_by"), ".", " ")
		db = db.Order(sort)
	}

	if err := db.Find(&authors).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.AuthorDTO, 0, len(authors))
	for _, author := range authors {
		data = append(data, author.ToDTO())
	}

	httputil.ResponseSuccess(ctx, gin.H{"data": data, "count": count})
}

// GetAuthor   		godoc
//
//	@Summary		Get author by ID
//	@Description	Returns a single author
//	@Tags			authors
//	@Produce		json
//	@Param			id	path		string	true	"Author ID or Author Link"
//	@Response		200	{object}	dto.AuthorSingleResult
//	@Failure		400	{object}	http.BadRequestResponse
//	@Router			/authors/{id} [get]
func GetAuthor(ctx *gin.Context) {
	var author models.Author

	column := "id"
	if _, err := uuid.FromString(ctx.Param("id")); err != nil {
		column = "link"
	}

	if err := models.DB.Where(fmt.Sprint(column, " = ?"), ctx.Param("id")).First(&author).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, author.ToDTO())
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

	if err := models.DB.Where("author_id = ?", ctx.Param("id")).Find(&works).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	data := make([]dto.WorkDTO, 0, len(works))
	for _, work := range works {
		data = append(data, work.ToDTO())
	}

	httputil.ResponseSuccess(ctx, data)
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
	var authorForm dto.AuthorDTO
	if err := ctx.Bind(&authorForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	file, err := ctx.FormFile("picture")
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var author models.Author
	author.ParseForm(authorForm)
	author.Link = translit.GenerateLinkFromText(author.NameRu)

	rootPath, err := filepath.Abs("./main.go")
	rootPath = filepath.Dir(filepath.Dir(rootPath))

	pictureName := author.Link + filepath.Ext(file.Filename)

	picturePath := filepath.Join(rootPath, "app", "public", "images", "authors", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}
	author.PicturePath = filepath.Join("/images", "authors", pictureName)

	if err = models.DB.Create(&author).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, author.ToDTO())
}

// UpdateAuthor   		godoc
//
//	@Summary	Update existence author
//	@Tags		authors
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		id		path		string				true	"Author ID"
//	@Param		body	formData	dto.AuthorDTO		true	"Author fields that needs to update"
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
	if err := models.DB.Where("id = ?", ctx.Param("id")).Find(&author).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var authorForm dto.AuthorDTO
	if err := ctx.Bind(&authorForm); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if authorForm.NameRu != "" {
		authorForm.Link = translit.GenerateLinkFromText(authorForm.NameRu)
	}

	if file, err := ctx.FormFile("picture"); err == nil {
		rootPath, err := filepath.Abs("./main.go")
		rootPath = filepath.Dir(filepath.Dir(rootPath))

		var pictureName string
		if authorForm.Link != "" {
			pictureName = authorForm.Link + filepath.Ext(file.Filename)
		} else {
			pictureName = author.Link + filepath.Ext(file.Filename)
		}

		picturePath := filepath.Join(rootPath, "app", "public", "images", "authors", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}
		authorForm.PicturePath = filepath.Join("/images", "authors", pictureName)
	}

	if err := models.DB.Model(&author).Updates(authorForm).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	httputil.ResponseSuccess(ctx, author.ToDTO())
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
	if err := models.DB.Where("id = ?", ctx.Param("id")).Delete(&models.Author{}).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
