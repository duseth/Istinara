package errors

type Error struct {
	Message string `json:"message"`
}

// New return new instance of error
func New(message string) Error {
	return Error{Message: message}
}
