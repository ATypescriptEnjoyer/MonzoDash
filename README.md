# MonzoDash

MonzoDash is a dockerised web app for monitoring and managing your Monzo bank account.

## Features

- Days to payday (with per day budget information)
- Dedicated spending chart
- Automatic payday pot dispersion
- Transaction logging
- None direct debit/standing order handling via pots

## Planned feature list

- Full transactional report
- Budgetting tools (to be decided)

## Technology In Use

- [NestJS (Typescript)](https://docs.nestjs.com/)
- [React (Typescript)](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)

## Installation

You need to use [docker](https://docs.docker.com/get-started/), and I recommend using [docker compose](https://docs.docker.com/compose/) to spin up MonzoDash!

### Example docker-compose.yml

```
version: "3.4"

services:
  monzodash:
    image: ghcr.io/sasharyder/monzodash:latest
    restart: unless-stopped
    links:
      - redis
      - mongo
    environment:
      - MONGO_USERNAME=${MONGO_USERNAME}
      - MONGO_PASSWORD=${MONGO_PASSWORD}
      - MONGO_HOST=${MONGO_HOST}
      - REDIS_URL=${REDIS_URL}
      - MONZO_CLIENT_ID=${MONZO_CLIENT_ID}
      - MONZO_CLIENT_SECRET=${MONZO_CLIENT_SECRET}
      - MONZODASH_DOMAIN=${MONZODASH_DOMAIN}
      - MONZODASH_WEBHOOK_DOMAIN=${MONZODASH_WEBHOOK_DOMAIN}

  mongo:
    image: mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - ./db:/data/db

  redis:
    image: redis:6.2.6-alpine
    restart: unless-stopped
    environment:
      - PGID=1000
      - PUID=1000
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - ./redis:/data
```

Before doing this, create a `.env` file along side your `docker-compose.yml` file.

```
MONGO_USERNAME=monzodash
MONGO_PASSWORD=monzodash
MONGO_HOST=mongo
REDIS_URL=redis://redis
MONZO_CLIENT_ID=
MONZO_CLIENT_SECRET=
MONZODASH_DOMAIN=http://localhost
MONZODASH_WEBHOOK_DOMAIN=http://localhost
```

- You can get `MONZO_CLIENT_ID` and `MONZO_CLIENT_SECRET` from `https://developers.monzo.com/`
- Set `MONZODASH_DOMAIN` to `https://YOUR_DOMAIN` (Where you'll setup nginx ect to access the frontend, or access directly)
- Set `MONZO_WEBHOOK_URI` to `https://YOUR_WEBHOOK_DOMAIN` (Where you'll process webhooks, I added this because I don't expose the MonzoDash frontend via NGINX, only the webhook endpoint.)

## Usage

Once everything is setup and you've setup NGINX ect, just go to what you've set as `MONZODASH_DOMAIN` and you will be presented with a login screen!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
