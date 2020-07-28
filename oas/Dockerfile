FROM swaggerapi/swagger-ui

ARG OAS_VERSION=v1
ARG OAS_NAME=appaltipop
ARG URL=/oas/api/${OAS_VERSION}/${OAS_NAME}.yml
ENV URL=${URL}

COPY v1/appaltipop.yml /usr/share/nginx/html/api/v1/
