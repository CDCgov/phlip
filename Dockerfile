FROM node:8.11.4

ENV NPM_CONFIG_LOGLEVEL error
SHELL ["/bin/bash", "-c"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN npm install --no-optional

CMD npm run start:local