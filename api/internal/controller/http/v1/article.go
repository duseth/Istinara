package v1

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

func (handler ArticleHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, private *gin.RouterGroup) {
	router.GET("/articles", handler.List)
	router.GET("/articles/:id", handler.Get)
	router.GET("/articles/signatures", handler.ListSignatures)

	router.GET("/articles/:id/links", handler.ListLinks)
	router.POST("/articles/:id/links", handler.CreateLink)
	router.DELETE("/articles/:id/links", handler.DeleteLink)

	private.POST("/articles", handler.Create)
	private.PATCH("/articles/:id", handler.Update)
	private.DELETE("/articles/:id", handler.Delete)
}

// List
//
//	@Summary	Gets list of articles
//	@Tags		Articles
//	@Produce	json
//	@Param		_	query		param.ListQueryWithSearch	false	"Query parameters"
//	@Success	200	{object}	dto.ListArticleDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/articles [get]
func (handler ArticleHandler) List(ctx *gin.Context) {
	var params param.ListQueryWithSearch
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

	var data []dto.ArticleDTO
	automapper.MapLoose(articles, &data)

	ctx.JSON(http.StatusOK, dto.ListArticleDTO{Count: count, Data: data})
}

func (handler ArticleHandler) ListSignatures(ctx *gin.Context) {
	var params param.ListQuery
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	articles, err := handler.usecase.ListSignatures(params.ToContext())
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list names of articles"))
		return
	}

	var data []dto.ArticleSignatureDTO
	automapper.Map(articles, &data)

	ctx.JSON(http.StatusOK, data)
}

// Get
//
//	@Summary	Get article
//	@Tags		Articles
//	@Produce	json
//	@Param		id	query		string	true	"Article 'id' or 'link'"
//	@Success	200	{object}	dto.CompleteArticleDTO
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

	var data dto.CompleteArticleDTO
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

	var data []dto.ArticleDTO
	automapper.MapLoose(articles, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler ArticleHandler) CreateLink(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' value"))
		return
	}

	linkID := ctx.Query("link_id")
	if linkID == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid link article 'id' value"))
		return
	}

	if err := handler.usecase.CreateLink(model.ArticleLink{ArticleID: id, LinkID: linkID}); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while creating article link"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}

func (handler ArticleHandler) DeleteLink(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' value"))
		return
	}

	linkID := ctx.Query("link_id")
	if linkID == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid link article 'id' value"))
		return
	}

	if err := handler.usecase.DeleteLink(id, linkID); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while deleting article link"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}

func (handler ArticleHandler) Create(ctx *gin.Context) {
	var form dto.ArticleFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var article model.Article
	automapper.MapLoose(form, &article)

	article.Link = translit.Translate(article.TitleRu, translit.Ru)

	if picturePath, err := utils.SaveFileFromRequest(ctx, "articles", article.Link); err == nil {
		article.PicturePath = picturePath
	}

	if err := handler.usecase.Create(&article); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid picture file"))
		return
	}

	var data dto.ArticleDTO
	automapper.Map(article, &data)

	ctx.JSON(http.StatusCreated, data)
}

func (handler ArticleHandler) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	var form dto.ArticleFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var values model.Article
	automapper.MapLoose(form, &values)

	work, err := handler.usecase.Get(context.WithValue(context.Background(), "user_id", ""), id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Article for updating not found"))
		return
	}

	if values.TitleRu != "" {
		values.Link = translit.Translate(values.TitleRu, translit.Ru)
	} else {
		values.Link = work.Link
	}

	if picturePath, err := utils.SaveFileFromRequest(ctx, "articles", values.Link); err == nil {
		values.PicturePath = picturePath
	}

	err = handler.usecase.Update(&work, values)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while updating author"))
		return
	}

	var data dto.ArticleDTO
	automapper.Map(work, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler ArticleHandler) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' value"))
		return
	}

	if err := handler.usecase.Delete(id); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while deleting article"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
