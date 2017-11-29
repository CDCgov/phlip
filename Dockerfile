FROM node:8.7.0

ENV NPM_CONFIG_LOGLEVEL warn
SHELL ["/bin/bash", "-c"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN npm install --no-optional

CMD npm run start:local

EXPOSE 3000
