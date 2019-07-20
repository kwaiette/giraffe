FROM node:8.15.0-alpine
LABEL maintainer "support@paladinarcher.com"

ENV PACKAGES imagemagick

RUN apk update && apk upgrade && \
	apk add $PACKAGES --no-cache && \
	rm -rf /var/cache/apk/*
