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

// ListWorks   		godoc
//
//	@Summary		Get all works
//	@Description	Returns list of all works
//	@Tags			works
//	@Produce		json
//	@Response		200	{object}	dto.WorkListResult
//	@Failure		500	{object}	http.InternalServerErrorResponse
//	@Router			/works [get]
func ListWorks(ctx *gin.Context) {
	var works []models.Work
	if err := models.DB.Preload("Author").Find(&works).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapWorks(works))
}

// GetWork   		godoc
//
//	@Summary		Get work by ID
//	@Description	Returns a single work
//	@Tags			works
//	@Produce		json
//	@Param			id	path		string	true	"Work ID"
//	@Response		200	{object}	dto.WorkSingleResult
//	@Failure		400	{object}	http.BadRequestResponse
//	@Router			/works/{id} [get]
func GetWork(ctx *gin.Context) {
	var work models.Work

	if err := models.DB.Preload("Author").Where("id = ?", ctx.Param("id")).First(&work).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapWork(work))
}

// GetArticlesByWork   		godoc
//
//	@Summary		Get all articles by work ID
//	@Description	Returns list of all articles
//	@Tags			works
//	@Produce		json
//	@Param			id	path		string	true	"Work ID"
//	@Response		200	{object}	dto.ArticleListResult
//	@Failure		400	{object}	http.BadRequestResponse
//	@Router			/works/{id}/articles [get]
func GetArticlesByWork(ctx *gin.Context) {
	var articles []models.Article

	if err := models.DB.Where("work_id = ?", ctx.Param("id")).Find(&articles).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapArticles(articles))
}

// CreateWork   		godoc
//
//	@Summary	Add a new work
//	@Tags		works
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		body	formData	dto.WorkInputForm	true	"Work object that needs to be added"
//	@Param		file	formData	file				true	"Work image"
//	@Response	200		{object}	dto.WorkSingleResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Failure	500		{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/works/{id} [post]
func CreateWork(ctx *gin.Context) {
	var workForm dto.WorkInputForm
	if err := ctx.Bind(&workForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	pictureName := uuid.New().String() + filepath.Ext(file.Filename)
	picturePath := filepath.Join("/app", "public", "assets", "images", "works", pictureName)
	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	var work models.Work
	mapper.ParseWork(workForm, &work)
	work.PicturePath = picturePath
	work.Link = translit.GenerateLinkFromText(work.TitleRu)

	if err = models.DB.Create(&work).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, mapper.MapWork(work))
}

// UpdateWork   		godoc
//
//	@Summary	Update existence work
//	@Tags		works
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		id		path		string				true	"Work ID"
//	@Param		body	formData	dto.WorkInputForm	true	"Work fields that needs to update"
//	@Param		file	formData	file				true	"Work image that needs update"
//	@Response	200		{object}	dto.WorkSingleResult
//	@Failure	400		{object}	http.BadRequestResponse
//	@Failure	500		{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/works/{id} [patch]
func UpdateWork(ctx *gin.Context) {
	var work models.Work
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&work).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	var workForm dto.WorkInputForm
	if err := ctx.Bind(&workForm); err != nil {
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
		picturePath = filepath.Join("/app", "public", "assets", "images", "works", pictureName)
		if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}

		err = os.Remove(work.PicturePath)
		if err != nil {
			log.Println(err.Error())
		}
	}

	if err := models.DB.Model(&work).Updates(&workForm).Error; err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Model(&work).Update("picture_path", picturePath).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	if workForm.TitleRu != "" {
		link := translit.GenerateLinkFromText(workForm.TitleRu)
		if err := models.DB.Model(&work).Update("link", link).Error; err != nil {
			httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
			return
		}
	}

	httputil.ResponseSuccess(ctx, mapper.MapWork(work))
}

// DeleteWork   		godoc
//
//	@Summary	Delete existence work
//	@Tags		works
//	@Produce	json
//	@Param		id	path		string	true	"Work ID"
//	@Response	200	{object}	http.SuccessResponse
//	@Failure	400	{object}	http.BadRequestResponse
//	@Failure	500	{object}	http.InternalServerErrorResponse
//
//	@Security	token
//
//	@Router		/works/{id} [delete]
func DeleteWork(ctx *gin.Context) {
	var work models.Work
	if err := models.DB.Where("id = ?", ctx.Param("id")).First(&work).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	if err := models.DB.Delete(&work).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
