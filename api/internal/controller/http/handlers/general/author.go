package general

import (
	"context"
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/param"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/duseth/istinara/api/internal/domain/model"
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

func (handler AuthorHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, _ *gin.RouterGroup) {
	router.GET("/authors", handler.List)
	router.GET("/authors/:id", handler.Get)
	router.GET("/authors/:id/works", handler.ListWorks)
}

// List
//
//	@Summary	Gets list of authors
//	@Tags		Authors
//	@Produce	json
//	@Param		_	query		param.ListQuery	false	"Query parameters"
//	@Success	200	{object}	dto.ListAuthorDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/authors [get]
func (handler AuthorHandler) List(ctx *gin.Context) {
	var params param.ListQuery
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	authors, count, err := handler.authorUsecase.List(params.ToContext())
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of authors"))
		return
	}

	var data []dto.AuthorDTO
	automapper.Map(authors, &data)

	ctx.JSON(http.StatusOK, dto.ListAuthorDTO{Count: count, Data: data})
}

// ListWorks
//
//	@Summary	Gets list of works by author
//	@Tags		Authors
//	@Produce	json
//	@Success	200	{object}	[]dto.WorkDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/authors/{id}/works [get]
func (handler AuthorHandler) ListWorks(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	var params param.ListQuery
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	var userID string
	if user, err := utils.ExtractData(ctx); err == nil {
		userID = user.ID.String()
	}
	nativeCtx := context.WithValue(params.ToContext(), "user_id", userID)

	articles, err := handler.workUsecase.ListByAuthor(nativeCtx, id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of works"))
		return
	}

	var data []dto.WorkDTO
	automapper.MapLoose(articles, &data)

	ctx.JSON(http.StatusOK, data)
}

// Get
//
//	@Summary	Get author
//	@Tags		Authors
//	@Produce	json
//	@Param		id	query		string	true	"Author 'id' or 'link'"
//	@Success	200	{object}	dto.AuthorDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/authors/{id} [get]
func (handler AuthorHandler) Get(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	author, err := handler.authorUsecase.Get(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting author"))
		return
	}

	var data dto.AuthorDTO
	automapper.Map(author, &data)

	ctx.JSON(http.StatusOK, data)
}
