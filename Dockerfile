FROM node:18.12.1-alpine AS api

COPY api /app/api
COPY shared /app/shared
WORKDIR /app/api
RUN yarn install
RUN yarn build

FROM node:18.12.1-alpine AS client

ENV REACT_APP_API_URL=/api
COPY client /app/client
COPY shared /app/shared
WORKDIR /app/client
COPY package.json rootpackage.json
RUN \
    yarn install && \
    export REACT_APP_VERSION=$(node -pe "require('./rootpackage.json').version") && \
    export REACT_APP_NAME=$(node -pe "require('./rootpackage.json').name") && \
    yarn build && \
    rm rootpackage.json

FROM node:18.12.1-alpine AS build

COPY --from=api /app/api/dist /app/dist
COPY --from=api /app/api/node_modules /app/node_modules
COPY --from=api /app/api/package.json /app/package.json
COPY --from=client /app/client/build /app/dist/api/src/client
EXPOSE 5000
WORKDIR /app

CMD [ "/bin/sh", "-c", "CLI_PATH=./dist/api/src/cli.js npx nestjs-command create:holidays; yarn start:prod" ]
