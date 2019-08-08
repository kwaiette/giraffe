FROM node:8.15.0-alpine
LABEL maintainer "support@paladinarcher.com"

ENV PACKAGES imagemagick msttcorefonts-installer fontconfig

RUN apk update && apk upgrade && \
	apk add $PACKAGES --no-cache && \
	update-ms-fonts && \
	fc-cache -f && \
	rm -rf /var/cache/apk/*

WORKDIR /usr/src/app/
ADD giraffe.tar.gz .
ENTRYPOINT [ "npm", "start" ]
