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

type WorkUsecase interface {
	Create(work *model.Work) error
	Get(id string) (model.Work, error)
	Update(work *model.Work, values interface{}) error
	Delete(id string) error

	List(ctx context.Context) ([]model.Work, int64, error)
	ListSignatures(ctx context.Context) ([]model.Work, error)
	ListByAuthor(ctx context.Context, id string) ([]model.Work, error)
}

type WorkHandler struct {
	workUsecase    WorkUsecase
	articleUsecase ArticleUsecase
}

func NewWorkHandler(workUsecase WorkUsecase, articleUsecase ArticleUsecase) *WorkHandler {
	return &WorkHandler{workUsecase: workUsecase, articleUsecase: articleUsecase}
}

func (handler WorkHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, private *gin.RouterGroup) {
	router.GET("/works", handler.List)
	router.GET("/works/:id", handler.Get)
	router.GET("/works/:id/articles", handler.ListArticles)
	router.GET("/works/signatures", handler.ListSignatures)

	private.POST("/works", handler.Create)
	private.PATCH("/works/:id", handler.Update)
	private.DELETE("/works/:id", handler.Delete)
}

// List
//
//	@Summary	Gets list of works
//	@Tags		Works
//	@Produce	json
//	@Param		_	query		param.ListQueryWithSearch	false	"Query parameters"
//	@Success	200	{object}	dto.ListWorkDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/works [get]
func (handler WorkHandler) List(ctx *gin.Context) {
	var params param.ListQueryWithSearch
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	works, count, err := handler.workUsecase.List(params.ToContext())
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of authors"))
		return
	}

	var data []dto.WorkDTO
	automapper.Map(works, &data)

	ctx.JSON(http.StatusOK, dto.ListWorkDTO{Count: count, Data: data})
}

// ListArticles
//
//	@Summary	Gets list of articles by work
//	@Tags		Works
//	@Produce	json
//	@Success	200	{object}	[]dto.ArticleDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/works/{id}/articles [get]
func (handler WorkHandler) ListArticles(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid work 'id' value"))
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

	articles, err := handler.articleUsecase.ListByWork(nativeCtx, id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of articles"))
		return
	}

	var data []dto.ArticleDTO
	automapper.MapLoose(articles, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler WorkHandler) ListSignatures(ctx *gin.Context) {
	var params param.ListQuery
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	works, err := handler.workUsecase.ListSignatures(params.ToContext())
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list names of works"))
		return
	}

	var data []dto.WorkNamesDTO
	automapper.Map(works, &data)

	ctx.JSON(http.StatusOK, data)
}

// Get
//
//	@Summary	Get work
//	@Tags		Works
//	@Produce	json
//	@Param		id	query		string	true	"Work 'id' or 'link'"
//	@Success	200	{object}	dto.CompleteWorkDTO
//	@Failure	400	{object}	errors.Error
//	@Failure	500	{object}	errors.Error
//	@Router		/works/{id} [get]
func (handler WorkHandler) Get(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid work 'id' value"))
		return
	}

	work, err := handler.workUsecase.Get(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting work"))
		return
	}

	var data dto.CompleteWorkDTO
	automapper.Map(work, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler WorkHandler) Create(ctx *gin.Context) {
	var form dto.WorkFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var work model.Work
	automapper.MapLoose(form, &work)

	work.Link = translit.Translate(work.TitleRu, translit.Ru)

	picturePath, err := utils.SaveFileFromRequest(ctx, "works", work.Link)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while processing uploaded file"))
		return
	}
	work.PicturePath = picturePath

	if err = handler.workUsecase.Create(&work); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid picture file"))
		return
	}

	var workDto dto.WorkDTO
	automapper.Map(work, &workDto)

	ctx.JSON(http.StatusCreated, workDto)
}

func (handler WorkHandler) Update(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid author 'id' value"))
		return
	}

	var form dto.WorkFormDTO
	if ctx.Bind(&form) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request form data"))
		return
	}

	var values model.Work
	automapper.MapLoose(form, &values)

	work, err := handler.workUsecase.Get(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Work for updating not found"))
		return
	}

	if values.TitleRu != "" {
		values.Link = translit.Translate(values.TitleRu, translit.Ru)
	} else {
		values.Link = work.Link
	}

	if picturePath, err := utils.SaveFileFromRequest(ctx, "works", values.Link); err == nil {
		values.PicturePath = picturePath
	}

	err = handler.workUsecase.Update(&work, values)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while updating author"))
		return
	}

	var data dto.WorkDTO
	automapper.Map(work, &data)

	ctx.JSON(http.StatusOK, data)
}

func (handler WorkHandler) Delete(ctx *gin.Context) {
	id := ctx.Param("id")
	if id == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid work 'id' value"))
		return
	}

	if err := handler.workUsecase.Delete(id); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while deleting work"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
