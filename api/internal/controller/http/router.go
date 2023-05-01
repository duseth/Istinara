package http

import (
	"time"

	_ "github.com/duseth/istinara/api/docs"
	"github.com/duseth/istinara/api/internal/controller/http/middlewares"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type IHandler interface {
	Register(router *gin.RouterGroup, protected *gin.RouterGroup, private *gin.RouterGroup)
}

var corsConfig = cors.Config{
	AllowAllOrigins:  true,
	AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
	AllowHeaders:     []string{"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"},
	MaxAge:           24 * time.Hour,
	AllowCredentials: true,
}

func NewRouter(handlers []IHandler) *gin.Engine {
	engine := gin.Default()

	// Initialize Swagger docs
	engine.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, func(config *ginSwagger.Config) {
		config.Title = "Istinara API"
		config.DefaultModelsExpandDepth = 5
	}))

	// General Middlewares
	engine.Use(cors.New(corsConfig))

	// Registration handlers to HTTP server
	router := engine.Group("/api")
	{
		protected := router.Group("")
		protected.Use(middlewares.JwtAuthMiddleware())

		private := protected.Group("")
		private.Use(middlewares.ProtectOperationsMiddleware())

		for _, handler := range handlers {
			handler.Register(router, protected, private)
		}
	}

	return engine
}
