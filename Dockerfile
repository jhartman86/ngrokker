FROM mhart/alpine-node:9.4.0

WORKDIR /app

RUN apk add --no-cache \
  make \
  g++ \
  build-base \
  openssl \
  git