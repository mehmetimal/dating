FROM node:16
MAINTAINER choi

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install
RUN npm install -g @angular/cli@8.3.12
RUN npm install --save-dev typescript@3.5.3

COPY ./ /usr/src/app

EXPOSE 80
RUN npm run build:ssr
COPY ./age-de.xml /usr/src/app/dist/browser
COPY ./age-de.xml /usr/src/app/dist/server

CMD [ "npm", "run", "serve:ssr" ]
