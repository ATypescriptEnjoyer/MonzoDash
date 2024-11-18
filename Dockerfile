FROM node:lts-slim AS build

COPY . /app
WORKDIR /app

RUN apt update && apt install python3 make g++ -y
RUN yarn install

RUN npx nx build api web-app
RUN VITE_APP_NAME=MonzoDash \
    VITE_APP_VERSION=$(node -pe "require('./package.json').version") \
    VITE_API_URL=/api \
    npx nx build web-app

FROM node:lts-slim AS final

COPY --from=build /app/dist/apps/api/ /app/dist
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 5000
WORKDIR /app

CMD ["node", "dist/main"]
