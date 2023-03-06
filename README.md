# Istinara

## Getting started

1. Add ```.env``` file to ```server``` directory
2. Add environment variables as shown below
    ### PostgreSQL container config
    ```
    POSTGRES_USER="postgres"
    POSTGRES_PASSWORD="postgres"
    POSTGRES_DB="postgres"
    PGCLIENTENCODING="utf-8"
    ```

    ### API container config
    ```
    GIN_MODE="release"
    PORT="8080"
    SSL_CERT="path/to/ssl/certificate.crt"
    SSL_KEY="path/to/ssl/private.key"
    API_SECRET="secret"
    TOKEN_HOUR_LIFESPAN="24"
    CONNECTION_STRING="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres_db:5432/${POSTGRES_DB}"
    IS_LOAD_DUMP="false"
    DUMP_FILE_NAME="initial_dump.json"
    ```

3. In terminal run ```docker-compose up --build```