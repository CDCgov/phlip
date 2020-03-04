FROM node:12

ENV NPM_CONFIG_LOGLEVEL error
ENV NODE_ENV development

SHELL ["/bin/bash", "-c"]

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .

RUN npm install --no-optional

CMD npm run start:local
