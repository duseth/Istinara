// Code generated by swaggo/swag. DO NOT EDIT
package web

import "github.com/swaggo/swag"

const docTemplateweb = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {
            "name": "Istinara",
            "url": "https://istinara.ru"
        },
        "license": {
            "name": "MIT License",
            "url": "https://spdx.org/licenses/MIT.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/user/password": {
            "post": {
                "security": [
                    {
                        "token": []
                    }
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Change user password",
                "parameters": [
                    {
                        "type": "string",
                        "name": "new_password",
                        "in": "formData"
                    },
                    {
                        "type": "string",
                        "name": "password",
                        "in": "formData"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "boolean"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/errors.Error"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/errors.Error"
                        }
                    }
                }
            }
        },
        "/user/update": {
            "post": {
                "security": [
                    {
                        "token": []
                    }
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Update user information",
                "parameters": [
                    {
                        "type": "string",
                        "name": "email",
                        "in": "formData"
                    },
                    {
                        "type": "string",
                        "name": "username",
                        "in": "formData"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/dto.UserDTO"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "$ref": "#/definitions/errors.Error"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/errors.Error"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "dto.UserDTO": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "string"
                },
                "is_privileged": {
                    "type": "boolean"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "errors.Error": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        }
    },
    "securityDefinitions": {
        "token": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfoWeb holds exported Swagger Info so clients can modify it
var SwaggerInfoWeb = &swag.Spec{
	Version:          "1.0",
	Host:             "istinara.ru",
	BasePath:         "/api",
	Schemes:          []string{"https"},
	Title:            "Istinara API (web-specific)",
	Description:      "Open online dictionary of culturally marked vocabulary of the Russian language with translation into Arabic Language",
	InfoInstanceName: "web",
	SwaggerTemplate:  docTemplateweb,
}

func init() {
	swag.Register(SwaggerInfoWeb.InstanceName(), SwaggerInfoWeb)
}
