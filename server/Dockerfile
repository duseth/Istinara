FROM golang:alpine

RUN apk update && apk add --no-cache git && apk add --no-cach bash && apk add build-base

WORKDIR /server
COPY . .

RUN go get -d -v 

RUN go install -v
RUN go install github.com/cosmtrek/air@latest

ENTRYPOINT ["air"]
