package general

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gin-gonic/gin"
	"github.com/peteprogrammer/go-automapper"
)

type ArticleTypeUsecase interface {
	Create(articleType *model.ArticleType) error
	Get(id string) (model.ArticleType, error)
	Update(articleType *model.ArticleType, values interface{}) error
	Delete(id string) error

	List() ([]model.ArticleType, error)
}

type ArticleTypeHandler struct {
	usecase ArticleTypeUsecase
}

func NewArticleTypeHandler(usecase ArticleTypeUsecase) *ArticleTypeHandler {
	return &ArticleTypeHandler{usecase: usecase}
}

func (handler ArticleTypeHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, _ *gin.RouterGroup) {
	router.GET("/articles/types", handler.List)
}

// List
//
//	@Summary	Gets list of article types
//	@Tags		Articles
//	@Produce	json
//	@Success	200	{object}	[]dto.ArticleTypeDTO
//	@Failure	500	{object}	errors.Error
//	@Router		/articles/types [get]
func (handler ArticleTypeHandler) List(ctx *gin.Context) {
	articleTypes, err := handler.usecase.List()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of article types"))
		return
	}

	var data []dto.ArticleTypeDTO
	automapper.Map(articleTypes, &data)

	ctx.JSON(http.StatusOK, data)
}
