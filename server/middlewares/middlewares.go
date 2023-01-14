package middlewares

import (
	"net/http"

	"github.com/duseth/istinara/server/models"
	httputil "github.com/duseth/istinara/server/utils/http"

	"github.com/duseth/istinara/server/utils/token"
	"github.com/gin-gonic/gin"
)

func JwtAuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		err := token.Validate(ctx)
		if err != nil {
			httputil.SendErrorResponseWithAbort(ctx, http.StatusUnauthorized, err)
			return
		}
		ctx.Next()
	}
}

func DataManipulationMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		uid, err := token.ExtractTokenID(ctx)
		if err != nil {
			httputil.SendErrorResponseWithAbort(ctx, http.StatusBadRequest, err)
			return
		}

		isPrivileged, err := models.CheckIfUserIsPrivileged(uid)
		if err != nil {
			httputil.SendErrorResponseWithAbort(ctx, http.StatusBadRequest, err)
			return
		}

		if !isPrivileged {
			httputil.SendErrorResponseWithAbort(ctx, http.StatusForbidden, err)
			return
		}

		ctx.Next()
	}
}
