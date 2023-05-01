package utils

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/duseth/istinara/api/internal/controller/http/dto"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
)

type JwtClaims struct {
	User      dto.UserDTO `json:"user,omitempty"`
	ExpiresAt int64       `json:"exp,omitempty"`
}

func (claims JwtClaims) Valid() error {
	if claims.ExpiresAt < time.Now().Unix() {
		return errors.New("authorization token is expired")
	}

	if claims.User.ID == uuid.Nil {
		return errors.New("authorization token user id error while parsing to UUID format")
	}

	if claims.User.Username == "" || claims.User.Email == "" {
		return errors.New("authorization token username or email is empty")
	}

	return nil
}

func GenerateToken(user dto.UserDTO) (string, error) {
	tokenLifespan, err := strconv.Atoi(os.Getenv("TOKEN_HOUR_LIFESPAN"))
	if err != nil {
		return "", err
	}

	claims := JwtClaims{
		User:      user,
		ExpiresAt: time.Now().Add(time.Hour * time.Duration(tokenLifespan)).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("API_SECRET")))
}

func ExtractData(ctx *gin.Context) (dto.UserDTO, error) {
	token, err := ParseToken(ctx)
	if err != nil {
		return dto.UserDTO{}, err
	}

	claims, ok := token.Claims.(*JwtClaims)
	if !ok || !token.Valid {
		return dto.UserDTO{}, errors.New("authorization token is not valid")
	}

	return claims.User, nil
}

func ParseToken(ctx *gin.Context) (*jwt.Token, error) {
	token := ctx.Request.Header.Get("Authorization")

	jwtToken, err := jwt.ParseWithClaims(token, &JwtClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("API_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	return jwtToken, nil
}
