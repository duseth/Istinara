package web

import (
	"context"
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/param"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"github.com/peteprogrammer/go-automapper"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecase interface {
	Get(email string) (model.User, error)
	Update(id string, user model.User) (model.User, error)

	ListFavourites(ctx context.Context, userID string) ([]model.Article, int64, error)
	CreateFavourite(favourite model.Favourite) error
	DeleteFavourite(userID string, articleID string) error
}

type UserHandler struct {
	usecase UserUsecase
}

func NewUserHandler(usecase UserUsecase) *UserHandler {
	return &UserHandler{usecase: usecase}
}

func (handler UserHandler) Register(_ *gin.RouterGroup, protected *gin.RouterGroup, _ *gin.RouterGroup) {
	protected.POST("/users/update", handler.Update)
	protected.POST("/users/password", handler.ChangePassword)

	protected.GET("/users/favourites", handler.ListFavourites)
	protected.POST("/users/favourites/:id", handler.CreateFavourite)
	protected.DELETE("/users/favourites/:id", handler.DeleteFavourite)
}

// Update
//
//	@Summary	Update user information
//	@Tags		Users
//
//	@Produce	json
//	@Param		body	formData	dto.UpdateUserInputForm	true	"User updating information"
//
//	@Success	200		{object}	dto.UserDTO
//	@Failure	400		{object}	errors.Error
//	@Failure	500		{object}	errors.Error
//
//	@Security	token
//
//	@Router		/user/update [post]
func (handler UserHandler) Update(ctx *gin.Context) {
	var updateForm dto.UpdateUserInputForm
	if err := ctx.Bind(&updateForm); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New(err.Error()))
		return
	}

	user, err := utils.ExtractData(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New(err.Error()))
		return
	}

	var updateUser model.User
	automapper.MapLoose(updateForm, &updateUser)

	updatedUser, err := handler.usecase.Update(user.ID.String(), updateUser)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New(err.Error()))
		return
	}

	var data dto.UserDTO
	automapper.Map(updatedUser, &data)

	ctx.JSON(http.StatusOK, data)
}

// ChangePassword
//
//	@Summary	Change user password
//	@Tags		Users
//
//	@Produce	json
//	@Param		body	formData	dto.ChangePasswordInputForm	true	"Password and new password values"
//
//	@Success	200		{object}	boolean
//	@Failure	400		{object}	errors.Error
//	@Failure	500		{object}	errors.Error
//
//	@Security	token
//
//	@Router		/user/password [post]
func (handler UserHandler) ChangePassword(ctx *gin.Context) {
	var passwordForm dto.ChangePasswordInputForm
	if err := ctx.Bind(&passwordForm); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid data for update"))
		return
	}

	user, err := utils.ExtractData(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Authorization token is invalid"))
		return
	}

	originUser, err := handler.usecase.Get(user.Email)
	err = bcrypt.CompareHashAndPassword([]byte(originUser.Password), []byte(passwordForm.Password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Incorrect 'password' for change password"))
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(passwordForm.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Error while generating hash for password"))
		return
	}

	_, err = handler.usecase.Update(user.ID.String(), model.User{Password: string(hash)})
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error when changing password"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}

func (handler UserHandler) ListFavourites(ctx *gin.Context) {
	user, err := utils.ExtractData(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Authorization token is invalid"))
		return
	}

	var params param.ListQuery
	if ctx.BindQuery(&params) != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid request query values"))
		return
	}

	favourites, count, err := handler.usecase.ListFavourites(params.ToContext(), user.ID.String())
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of favourites"))
		return
	}

	var data []dto.ArticleDto
	automapper.MapLoose(favourites, &data)

	ctx.JSON(http.StatusOK, dto.ListArticleDto{Count: count, Data: data})
}

func (handler UserHandler) CreateFavourite(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' query value"))
		return
	}

	user, err := utils.ExtractData(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Authorization token is invalid"))
		return
	}

	favourite := model.Favourite{UserID: user.ID, ArticleID: id}
	if err = handler.usecase.CreateFavourite(favourite); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error deleting favourite article"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}

func (handler UserHandler) DeleteFavourite(ctx *gin.Context) {
	id, err := uuid.FromString(ctx.Param("id"))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid article 'id' query value"))
		return
	}

	user, err := utils.ExtractData(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Authorization token is invalid"))
		return
	}

	if err = handler.usecase.DeleteFavourite(user.ID.String(), id.String()); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error getting list of favourites"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
