FROM node:8.15.0-alpine
LABEL maintainer "support@paladinarcher.com"

ENV PACKAGES bash imagemagick openssh-client

RUN apk update && apk upgrade && \
	apk add $PACKAGES --no-cache && \
	rm -rf /var/cache/apk/*

WORKDIR /usr/src/app/
ADD giraffe.tar.gz .
ENTRYPOINT [ "npm", "start" ]
