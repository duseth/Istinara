package web

import (
	"fmt"

	spec "github.com/duseth/istinara/api/docs/web"
	http "github.com/duseth/istinara/api/internal/controller/http/handlers"
	"github.com/duseth/istinara/api/internal/controller/http/middlewares"
	"github.com/gin-gonic/gin"
	httpSwagger "github.com/swaggo/http-swagger"
	"github.com/swaggo/swag"
)

//	@title			Istinara API (web-specific)
//	@version		1.0
//	@description	Open online dictionary of culturally marked vocabulary of the Russian language with translation into Arabic Language

//	@contact.name	Istinara
//	@contact.url	https://istinara.ru

//	@license.name	MIT License
//	@license.url	https://spdx.org/licenses/MIT.html

//	@host		istinara.ru
//	@BasePath	/api

//	@schemes	https

// @securityDefinitions.apikey	token
// @in							header
// @name						Authorization
func Register(router *gin.RouterGroup, handlers []http.IHandler) {
	// Initialize Swagger docs
	router.GET("/web/docs/*any", SwaggerHandler)

	protected := router.Group("")
	protected.Use(middlewares.JwtAuthMiddleware())

	private := protected.Group("")
	private.Use(middlewares.ProtectOperationsMiddleware())

	for _, handler := range handlers {
		handler.Register(router, protected, private)
	}
}

func SwaggerHandler(ctx *gin.Context) {
	func(spec *swag.Spec, ctx *gin.Context) {
		instName := spec.InstanceName()

		gin.WrapH(httpSwagger.Handler(
			httpSwagger.InstanceName(instName),
			httpSwagger.URL(fmt.Sprintf("doc.json")),
			httpSwagger.UIConfig(map[string]string{
				"defaultModelsExpandDepth": "5",
			}),
		))(ctx)
	}(spec.SwaggerInfoWeb, ctx)
}
