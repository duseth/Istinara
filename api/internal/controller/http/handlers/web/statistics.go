package web

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/gin-gonic/gin"
)

type StatisticsUsecase interface {
	ListScores() (dto.ScoresDTO, error)
}

type StatisticsHandler struct {
	usecase StatisticsUsecase
}

func NewStatisticsHandler(usecase StatisticsUsecase) *StatisticsHandler {
	return &StatisticsHandler{usecase: usecase}
}

func (handler StatisticsHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, _ *gin.RouterGroup) {
	router.GET("/statistics/scores", handler.ListScores)
}

func (handler StatisticsHandler) ListScores(ctx *gin.Context) {
	scores, err := handler.usecase.ListScores()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error while getting scores"))
	}

	ctx.JSON(http.StatusOK, scores)
}
