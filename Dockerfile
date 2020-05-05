FROM node:14-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install

# Copying source files
COPY src/ ./src
COPY public/ ./public

# Expose default port
EXPOSE 3000

# Running the app
CMD [ "npm", "start" ]
