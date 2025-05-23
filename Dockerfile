FROM node:lts-slim AS build

COPY . /app
WORKDIR /app

RUN apt-get update && apt-get install python3 make g++ -y
RUN yarn install

RUN VITE_APP_NAME=MonzoDash \
    VITE_APP_VERSION=$(node -pe "require('./package.json').version") \
    VITE_API_URL=/api \
    yarn nx run-many --target=build --all

# Attempt to shrink docker image size
RUN yarn install --production

FROM node:lts-slim AS final

COPY --from=build /app/dist/apps/api/ /app/dist
COPY --from=build /app/dist/libs/db/ /app/db
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 5000
WORKDIR /app

CMD ["/bin/sh", "-c", "./node_modules/typeorm/cli.js migration:run -d db/src/index.js && node dist/main"]
