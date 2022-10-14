FROM node:16.18.0 AS api

COPY api /app/api
COPY shared /app/shared
WORKDIR /app/api
RUN yarn install
RUN yarn build

FROM node:16.18.0 AS client

ENV REACT_APP_API_URL=/api
COPY client /app/client
COPY shared /app/shared
WORKDIR /app/client
RUN yarn install
RUN REACT_APP_VERSION=$(npm pkg get version | tr -d '"') REACT_APP_NAME=$(npm pkg get name | tr -d '"') yarn build

FROM node:16.18.0 AS build

COPY --from=api /app/api/dist /app/dist
COPY --from=api /app/api/node_modules /app/node_modules
COPY --from=api /app/api/package.json /app/package.json
COPY --from=client /app/client/build /app/dist/api/src/client
EXPOSE 5000
WORKDIR /app

CMD [ "yarn", "start:prod" ]
