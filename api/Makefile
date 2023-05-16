#!make
include .env

generate_docs:
	swag fmt
	swag init -g router.go -d internal/controller/http/handlers/general -pd -o ./docs/general --instanceName general
	swag init -g router.go -d internal/controller/http/handlers/web -pd -o ./docs/web --instanceName web

migrations_up:
	migrate -database CONNECTION_STRING -path migrations -verbose up

migrations_down:
	migrate -path ./migrations -database "${CONNECTION_STRING}" -verbose down