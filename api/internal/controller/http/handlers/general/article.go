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

type ArticleUsecase interface {
	Create(author *model.Article) error
	Get(ctx context.Context, id string) (model.Article, error)
	Update(author *model.Article, values interface{}) error
	Delete(id string) error

	List(ctx context.Context) ([]model.Article, int64, error)
	ListSignatures(ctx context.Context) ([]model.Article, error)
	ListByWork(ctx context.Context, workID string) ([]model.Article, error)

	ListLinked(ctx context.Context, id string) ([]model.Article, error)
	CreateLink(link model.ArticleLink) error
	DeleteLink(articleID string, linkID string) error
}

type ArticleHandler struct {
	usecase ArticleUsecase
}

func NewArticleHandler(usecase ArticleUsecase) *ArticleHandler {
	return &ArticleHandler{usecase: usecase}
}

func (handler ArticleHandler) Register(router, _, _ *gin.RouterGroup) {
	router.GET("/articles", handler.List)
	router.GET("/articles/:id", handler.Get)
	router.GET("/articles/:id/links", handler.ListLinks)
}

// List godoc
//
//	@Summary	Gets list of articles
//	@Tags		Articles
//	@Produce	json
//	@Param		_	query		param.ListQuery	false	"Query parameters"
//	@Success	200	{object}	dto.ListArticleDto
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/articles [get]
func (handler ArticleHandler) List(ctx *gin.Context) {
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

	articles, count, err := handler.usecase.List(nativeCtx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of articles"))
		return
	}

	var data []dto.ArticleDto
	automapper.MapLoose(articles, &data)

	ctx.JSON(http.StatusOK, dto.ListArticleDto{Count: count, Data: data})
}

// Get
//
//	@Summary	Get article
//	@Tags		Articles
//	@Produce	json
//	@Param		id	query		string	true	"Article 'id' or 'link'"
//	@Success	200	{object}	dto.CompleteArticleDto
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/articles/{id} [get]
func (handler ArticleHandler) Get(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' value"))
		return
	}

	var userID string
	if user, err := utils.ExtractData(ctx); err == nil {
		userID = user.ID.String()
	}
	nativeCtx := context.WithValue(context.Background(), "user_id", userID)

	article, err := handler.usecase.Get(nativeCtx, id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting article"))
		return
	}

	var data dto.CompleteArticleDto
	automapper.MapLoose(article, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler ArticleHandler) ListLinks(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' value"))
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

	articles, err := handler.usecase.ListLinked(nativeCtx, id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting linked articles"))
		return
	}

	var data []dto.ArticleDto
	automapper.MapLoose(articles, &data)

	ctx.JSON(http.StatusOK, data)
}
