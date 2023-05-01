package utils

import (
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func SaveFileFromRequest(ctx *gin.Context, directory string, filename string) (string, error) {
	file, err := ctx.FormFile("picture")
	if err != nil {
		return "", err
	}

	rootPath, err := filepath.Abs("./main.exe")
	rootPath = filepath.Dir(filepath.Dir(rootPath))

	filename += filepath.Ext(file.Filename)
	picturePath := filepath.Join(rootPath, "app", "public", "images", directory, filename)

	if err = ctx.SaveUploadedFile(file, picturePath); err != nil {
		return "", err
	}

	return filepath.Join("/images", directory, filename), nil
}
