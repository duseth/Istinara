package v1

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gin-gonic/gin"
	"github.com/peteprogrammer/go-automapper"
)

type FeedbackUsecase interface {
	Create(feedback model.Feedback) error
}

type FeedbackHandler struct {
	usecase FeedbackUsecase
}

func NewFeedbackHandler(usecase FeedbackUsecase) *FeedbackHandler {
	return &FeedbackHandler{usecase: usecase}
}

func (handler FeedbackHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, _ *gin.RouterGroup) {
	router.POST("/articles/:id/feedback", handler.Create)
}

func (handler FeedbackHandler) Create(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' value"))
		return
	}

	var form dto.FeedbackFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var feedback model.Feedback
	automapper.MapLoose(form, &feedback)
	feedback.ArticleID = id

	err := handler.usecase.Create(feedback)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error creating feedback"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
