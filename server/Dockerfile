# Start from golang base image
FROM golang:alpine

# Install git.
RUN apk update && apk add --no-cache git && apk add --no-cach bash && apk add build-base

# Copy the source from the current directory to the working Directory inside the container
COPY . /server

# Set working directory
WORKDIR /server

# Download all the dependencies
RUN go get -d -v 

# Install the package
RUN go install -v
RUN go install github.com/cosmtrek/air@latest

# Expose port 5000 to the outside world
EXPOSE 5000

# Run the executable
ENTRYPOINT ["air"]
