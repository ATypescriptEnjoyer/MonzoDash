FROM node:16.18.0 AS api

COPY api /app/api
COPY shared /app/shared
WORKDIR /app/api
RUN yarn install
RUN yarn build

FROM node:16.18.0 AS client

ENV REACT_APP_API_URL=/api
COPY package.json rootpackage.json
RUN export REACT_APP_VERSION=$(node -pe "require('./rootpackage.json').version");
RUN export REACT_APP_NAME=$(node -pe "require('./rootpackage.json').name");
COPY client /app/client
COPY shared /app/shared
WORKDIR /app/client
RUN yarn install
RUN yarn build

FROM node:16.18.0 AS build

COPY --from=api /app/api/dist /app/dist
COPY --from=api /app/api/node_modules /app/node_modules
COPY --from=api /app/api/package.json /app/package.json
COPY --from=client /app/client/build /app/dist/api/src/client
EXPOSE 5000
WORKDIR /app

CMD [ "/bin/bash", "-c", "CLI_PATH=./dist/api/src/cli.js npx nestjs-command create:holidays; yarn start:prod" ]
