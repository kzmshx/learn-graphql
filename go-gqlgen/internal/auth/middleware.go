package auth

import (
	"context"
	"github.com/kzmshx/learn-graphql/go-gqlgen/internal/users"
	"github.com/kzmshx/learn-graphql/go-gqlgen/pkg/jwt"
	"net/http"
	"strconv"
)

var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")

			// allow unauthenticated users in
			if header == "" {
				next.ServeHTTP(w, r)
				return
			}

			// validate jwt token
			tokenStr := header
			username, err := jwt.ParseToken(tokenStr)
			if err != nil {
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}

			// check if username exists in database
			id, err := users.GetUserIdByUsername(username)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			// put user in context and call the next with new context
			user := users.User{
				ID:       strconv.Itoa(id),
				Username: username,
			}
			newCtx := context.WithValue(r.Context(), userCtxKey, &user)
			next.ServeHTTP(w, r.WithContext(newCtx))
		})
	}
}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) *users.User {
	raw, _ := ctx.Value(userCtxKey).(*users.User)
	return raw
}
