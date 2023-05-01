package middlewares

import (
	"net/http"

	"github.com/duseth/istinara/api/internal/controller/http/errors"
	"github.com/duseth/istinara/api/internal/controller/http/utils"
	"github.com/gin-gonic/gin"
)

func ProtectOperationsMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user, err := utils.ExtractData(ctx)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, errors.New("Authorization token is not valid"))
			return
		}

		if !user.IsPrivileged {
			ctx.AbortWithStatusJSON(http.StatusForbidden, errors.New("Permission denied"))
			return
		}

		ctx.Next()
	}
}
