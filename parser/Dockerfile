FROM node:15.3.0-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
