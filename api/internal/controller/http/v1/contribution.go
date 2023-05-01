package v1

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gin-gonic/gin"
	"github.com/peteprogrammer/go-automapper"
)

type ContributionUsecase interface {
	Create(contribution model.Contribution) error
}

type ContributionHandler struct {
	usecase ContributionUsecase
}

func NewContributionHandler(usecase ContributionUsecase) *ContributionHandler {
	return &ContributionHandler{usecase: usecase}
}

func (handler ContributionHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, _ *gin.RouterGroup) {
	router.POST("/articles/contributions", handler.Create)
}

func (handler ContributionHandler) Create(ctx *gin.Context) {
	var form dto.ContributionDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var contribution model.Contribution
	automapper.MapLoose(form, &contribution)

	err := handler.usecase.Create(contribution)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error creating contribution"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
