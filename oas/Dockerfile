FROM swaggerapi/swagger-ui

ARG OAS_VERSION=v1
ARG OAS_NAME=appaltipop
ARG URL=/api/${OAS_VERSION}/${OAS_NAME}.${OAS_VERSION}.yml
ENV URL=${URL}

COPY v1/${OAS_NAME}.yml /usr/share/nginx/html/${OAS_NAME}.v1.yml
