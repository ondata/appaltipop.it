FROM node:14-alpine

ARG ES_SCHEME=http
ARG ES_HOST=localhost
ARG ES_PORT=9200
ARG ES_INDEX_PREFIX=appaltipop
ARG ES_AUTH_USERNAME=
ARG ES_AUTH_PASSWORD=

ENV ES_SCHEME=${ES_SCHEME}
ENV ES_HOST=${ES_HOST}
ENV ES_PORT=${ES_PORT}
ENV ES_INDEX_PREFIX=${ES_INDEX_PREFIX}
ENV ES_AUTH_USERNAME=${ES_AUTH_USERNAME}
ENV ES_AUTH_PASSWORD=${ES_AUTH_PASSWORD}

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY next.config.js ./
COPY src/ ./src
COPY public/ ./public

# Expose default port
EXPOSE 3000

# Running the app
CMD [ "npm", "start" ]
