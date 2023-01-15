package http

// SuccessResponse HTTP response for 200 status
type SuccessResponse struct {
	Status int  `json:"status" example:"200"`
	Data   bool `json:"data" example:"true"`
}

// BadRequestResponse HTTP response for 400 status
type BadRequestResponse struct {
	Status  int    `json:"status" example:"400"`
	Message string `json:"message" example:"Bad request"`
}

// UnauthorizedResponse HTTP response for 401 status
type UnauthorizedResponse struct {
	Status  int    `json:"status" example:"401"`
	Message string `json:"message" example:"Unauthorized"`
}

// ForbiddenResponse HTTP response for 403 status
type ForbiddenResponse struct {
	Status  int    `json:"status" example:"403"`
	Message string `json:"message" example:"Forbidden"`
}

// InternalServerErrorResponse HTTP response for 500 status
type InternalServerErrorResponse struct {
	Status  int    `json:"status" example:"500"`
	Message string `json:"message" example:"Internal Server Error"`
}
