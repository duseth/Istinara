package controllers

import (
	"net/http"

	"github.com/duseth/istinara/server/dto"
	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
)

func ListFeedbacks(ctx *gin.Context) {
	var feedbacks []models.Feedback
	if err := models.DB.Preload("Article").Preload("Group").Find(&feedbacks).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	data := make([]dto.FeedbackDTO, 0, len(feedbacks))
	for _, feedback := range feedbacks {
		data = append(data, feedback.ToDTO())
	}

	httputil.ResponseSuccess(ctx, data)
}

func GetFeedback(ctx *gin.Context) {
	var feedback models.Feedback

	err := models.DB.Preload("Article").Preload("Group").Where("id = ?", ctx.Param("id")).First(&feedback).Error
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, feedback.ToDTO())
}

func CreateFeedback(ctx *gin.Context) {
	var feedbackForm dto.FeedbackInputForm
	if err := ctx.Bind(&feedbackForm); err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	articleID, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	var feedback models.Feedback
	feedback.ArticleID = articleID
	feedback.ParseForm(feedbackForm)

	if err := models.DB.Create(&feedback).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusInternalServerError, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}

func DeleteFeedback(ctx *gin.Context) {
	if err := models.DB.Where("id = ?", ctx.Param("id")).Delete(&models.Feedback{}).Error; err != nil {
		httputil.ResponseErrorWithAbort(ctx, http.StatusBadRequest, err)
		return
	}

	httputil.ResponseSuccess(ctx, true)
}
