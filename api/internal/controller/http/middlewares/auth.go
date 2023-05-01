package middlewares

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/gin-gonic/gin"
)

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if _, err := utils.ParseToken(ctx); err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, errors.New("Authorization token is not valid"))
			return
		}
		ctx.Next()
	}
}
