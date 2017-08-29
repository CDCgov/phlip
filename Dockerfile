FROM node:8.4.0

ENV NPM_CONFIG_LOGLEVEL warn
SHELL ["/bin/bash", "-c"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN npm install

CMD npm start

EXPOSE 3000