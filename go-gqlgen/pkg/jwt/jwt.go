package jwt

import (
	"github.com/golang-jwt/jwt/v5"
	"log"
	"time"
)

var (
	// SecretKey is a secret key being used to sign tokens
	SecretKey = []byte("secret")
)

// GenerateToken generates a jwt token and assign a username to its claims and return it
func GenerateToken(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = username
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		log.Fatal("Error in Generating key")
		return "", err
	}

	return tokenString, nil
}

// ParseToken parses a jwt token and returns the username in its claims
func ParseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username := claims["username"].(string)
		return username, nil
	} else {
		return "", err
	}
}
