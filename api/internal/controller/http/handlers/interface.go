package http

import "github.com/gin-gonic/gin"

type IHandler interface {
	Register(router, protected, private *gin.RouterGroup)
}
