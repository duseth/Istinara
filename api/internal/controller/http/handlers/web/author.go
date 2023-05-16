package web

import (
	"context"
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/param"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/duseth/istinara/api/pkg/utils/translit"
	"github.com/gin-gonic/gin"
	"github.com/peteprogrammer/go-automapper"
)

type AuthorUsecase interface {
	Create(author *model.Author) error
	Get(id string) (model.Author, error)
	Update(author *model.Author, values interface{}) error
	Delete(id string) error

	List(ctx context.Context) ([]model.Author, int64, error)
	ListSignatures(ctx context.Context) ([]model.Author, error)
}

type AuthorHandler struct {
	authorUsecase AuthorUsecase
	workUsecase   WorkUsecase
}

func NewAuthorHandler(authorUsecase AuthorUsecase, workUsecase WorkUsecase) *AuthorHandler {
	return &AuthorHandler{authorUsecase: authorUsecase, workUsecase: workUsecase}
}

func (handler AuthorHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, private *gin.RouterGroup) {
	router.GET("/authors/signatures", handler.ListSignatures)

	private.POST("/authors", handler.Create)
	private.PATCH("/authors/:id", handler.Update)
	private.DELETE("/authors/:id", handler.Delete)
}

func (handler AuthorHandler) ListSignatures(ctx *gin.Context) {
	var params param.ListQuery
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	authors, err := handler.authorUsecase.ListSignatures(params.ToContext())
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list names of authors"))
		return
	}

	var data []dto.AuthorNamesDTO
	automapper.Map(authors, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler AuthorHandler) Create(ctx *gin.Context) {
	var form dto.AuthorFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var author model.Author
	automapper.MapLoose(form, &author)

	author.Link = translit.Translate(author.NameRu, translit.Ru)

	picturePath, err := utils.SaveFileFromRequest(ctx, "authors", author.Link)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while processing uploaded file"))
		return
	}
	author.PicturePath = picturePath

	if err = handler.authorUsecase.Create(&author); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid picture file"))
		return
	}

	var authorDto dto.AuthorDTO
	automapper.Map(author, &authorDto)

	ctx.JSON(http.StatusCreated, authorDto)
}

func (handler AuthorHandler) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	var form dto.AuthorFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var values model.Author
	automapper.MapLoose(form, &values)

	author, err := handler.authorUsecase.Get(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Author for updating not found"))
		return
	}

	if values.NameRu != "" {
		values.Link = translit.Translate(values.NameRu, translit.Ru)
	} else {
		values.Link = author.Link
	}

	if picturePath, err := utils.SaveFileFromRequest(ctx, "authors", values.Link); err == nil {
		values.PicturePath = picturePath
	}

	err = handler.authorUsecase.Update(&author, values)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while updating author"))
		return
	}

	var data dto.AuthorDTO
	automapper.Map(author, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler AuthorHandler) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	if err := handler.authorUsecase.Delete(id); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while deleting author"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
