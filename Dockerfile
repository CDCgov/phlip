FROM node:8.7.0

ENV NPM_CONFIG_LOGLEVEL error
ENV APP_LOG_REQUESTS true
SHELL ["/bin/bash", "-c"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN npm install --no-optional

CMD npm run start:local