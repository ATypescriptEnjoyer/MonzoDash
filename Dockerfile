FROM node:21.5.0-alpine AS api

COPY api /app/api
COPY shared /app/shared
WORKDIR /app/api
RUN yarn install && \
    yarn build && \
    rm -rf shared && \
    yarn install --production

FROM node:21.5.0-alpine AS client

COPY client /app/client
COPY shared /app/shared
WORKDIR /app/client
COPY package.json rootpackage.json
RUN \
    yarn install && \
    export VITE_APP_VERSION=$(node -pe "require('./rootpackage.json').version") && \
    export VITE_APP_NAME=$(node -pe "require('./rootpackage.json').name") && \
    VITE_API_URL=/api yarn build && \
    rm rootpackage.json

FROM node:21.5.0-alpine AS build

COPY --from=api /app/api/dist/ /app/dist
COPY --from=api /app/api/node_modules/ /app/node_modules
COPY --from=api /app/api/package.json /app/package.json
COPY --from=client /app/client/dist /app/dist/api/src/client
EXPOSE 5000
WORKDIR /app

CMD [ "/bin/sh", "-c", "yarn start:prod" ]
