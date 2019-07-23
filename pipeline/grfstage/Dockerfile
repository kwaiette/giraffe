FROM node:8.15.0-alpine
LABEL maintainer "support@paladinarcher.com"

ENV PACKAGES imagemagick wget unzip fc-list

RUN apk update && apk upgrade && \
	apk add $PACKAGES --no-cache && \
	rm -rf /var/cache/apk/*

WORKDIR .fonts
RUN wget https://www.paratype.ru/uni/public/PTSans.zip \
      -O .fonts/PTSans.zip && \
    cd .fonts && \
	unzip PTSans.zip && \
	cp -rfv .fonts /usr/share/fonts && \
	cd /usr/share/fonts/ && \
	sudo mv .fonts/ pt_sans/ && \
	cd pt_sans && \
	fc-cache -fv && \
	fc-list

WORKDIR /usr/src/app/
ADD giraffe.tar.gz .
ENTRYPOINT [ "npm", "start" ]
