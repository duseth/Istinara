package general

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/duseth/istinara/api/internal/domain/model"
	"github.com/gin-gonic/gin"
	"github.com/peteprogrammer/go-automapper"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	Get(email string) (model.User, error)
	Create(user model.User) error
}

type AuthHandler struct {
	usecase AuthUsecase
}

func NewAuthHandler(usecase AuthUsecase) *AuthHandler {
	return &AuthHandler{usecase: usecase}
}

func (handler AuthHandler) Register(router *gin.RouterGroup, _ *gin.RouterGroup, _ *gin.RouterGroup) {
	router.POST("/login", handler.Login)
	router.POST("/register", handler.Registration)
}

// Login
//
//	@Summary	Authorization
//	@Tags		Auth
//	@Produce	json
//	@Param		body	formData	dto.LoginForm	true	"User credentials for authorization"
//	@Success	200		{object}	string
//	@Failure	400		{object}	errors.Error
//	@Failure	500		{object}	errors.Error
//	@Router		/login [post]
func (handler AuthHandler) Login(ctx *gin.Context) {
	var input dto.LoginForm
	if err := ctx.Bind(&input); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid credentials for authorization"))
		return
	}

	user, err := handler.usecase.Get(input.Email)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Incorrect 'email' for authorization"))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Incorrect 'password' for authorization"))
		return
	}

	var userDto dto.UserDTO
	automapper.Map(user, &userDto)

	generatedToken, err := utils.GenerateToken(userDto)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error generating authorization token"))
		return
	}

	ctx.JSON(http.StatusOK, generatedToken)
}

// Registration
//
//	@Summary	Registration
//	@Tags		Auth
//	@Produce	json
//	@Param		body	formData	dto.RegisterForm	true	"User credentials for register"
//	@Success	200		{object}	boolean
//	@Failure	400		{object}	errors.Error
//	@Failure	500		{object}	errors.Error
//	@Router		/register [post]
func (handler AuthHandler) Registration(ctx *gin.Context) {
	var input dto.RegisterForm
	if err := ctx.Bind(&input); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Invalid credentials for registration"))
		return
	}

	var user model.User
	automapper.MapLoose(input, &user)

	err := handler.usecase.Create(user)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, errors.New("Error when registering a new user"))
		return
	}

	ctx.JSON(http.StatusOK, true)
}
