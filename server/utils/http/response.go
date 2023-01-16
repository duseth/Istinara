package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Error HTTP response
type Error struct {
	Status  int
	Message string
}

// ResponseErrorWithAbort abort current request and send JSON response
func ResponseErrorWithAbort(ctx *gin.Context, status int, err error) {
	response := Error{
		Status:  status,
		Message: err.Error(),
	}
	ctx.Abort()
	ctx.JSON(status, response)
}

// ResponseSuccess send 200 OK status with success result as JSON response
func ResponseSuccess(ctx *gin.Context, data interface{}) {
	ctx.JSON(http.StatusOK, data)
}
