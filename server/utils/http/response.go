package http

import "github.com/gin-gonic/gin"

// SendErrorResponseWithAbort method for handling HTTP errors
func SendErrorResponseWithAbort(ctx *gin.Context, status int, err error) {
	response := Error{
		Status: status,
		Data:   err.Error(),
	}
	ctx.Abort()
	ctx.JSON(status, response)
}

// SendSuccessResponse method for handling HTTP success requests
func SendSuccessResponse(ctx *gin.Context, status int, data any) {
	response := Success{
		Status: status,
		Data:   data,
	}
	ctx.JSON(status, response)
}

// Error HTTP error response
type Error struct {
	Status int    `json:"status" example:"400"`
	Data   string `json:"data" example:"Bad request"`
}

// Success HTTP success response
type Success struct {
	Status int `json:"status" example:"200"`
	Data   any `json:"data" example:"OK"`
}
