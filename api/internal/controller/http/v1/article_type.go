package v1

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/duseth/istinara/api/pkg/utils/translit"
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

func (handler ArticleTypeHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, private *gin.RouterGroup) {
	router.GET("/articles/types", handler.List)

	private.POST("/articles/types", handler.Create)
	private.PATCH("/articles/types/:id", handler.Update)
	private.DELETE("/articles/types/:id", handler.Delete)
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

func (handler ArticleTypeHandler) Create(ctx *gin.Context) {
	var form dto.ArticleTypeFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var articleType model.ArticleType
	automapper.MapLoose(form, &articleType)

	filename := translit.Translate(articleType.NameRu, translit.Ru)
	if picturePath, err := utils.SaveFileFromRequest(ctx, "article_types", filename); err == nil {
		articleType.PicturePath = picturePath
	}

	if err := handler.usecase.Create(&articleType); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid picture file"))
		return
	}

	var data dto.ArticleTypeDTO
	automapper.Map(articleType, &data)

	ctx.JSON(http.StatusCreated, data)
}

func (handler ArticleTypeHandler) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	var form dto.ArticleTypeFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var values model.ArticleType
	automapper.MapLoose(form, &values)

	articleType, err := handler.usecase.Get(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("ArticleType for updating not found"))
		return
	}

	var filename string
	if values.NameRu != "" {
		filename = translit.Translate(values.NameRu, translit.Ru)
	} else {
		filename = translit.Translate(articleType.NameRu, translit.Ru)
	}

	if picturePath, err := utils.SaveFileFromRequest(ctx, "article_types", filename); err == nil {
		values.PicturePath = picturePath
	}

	err = handler.usecase.Update(&articleType, values)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while updating article type"))
		return
	}

	var data dto.ArticleTypeDTO
	automapper.Map(articleType, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler ArticleTypeHandler) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article type 'id' value"))
		return
	}

	if err := handler.usecase.Delete(id); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while deleting article type"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
