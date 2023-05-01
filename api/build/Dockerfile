FROM golang:alpine

WORKDIR /api

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

CMD ["go", "run", "/api/cmd/app/main.go"]