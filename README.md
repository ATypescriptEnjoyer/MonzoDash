<p align="center">
  <a href="./" target="blank"><img src="https://github.com/SashaRyder/MonzoDash/blob/master/apps/web-app/public/icon-192x192.png?raw=true" width="120" alt="MonzoDash Logo" /></a>
</p>

<p align="center">MonzoDash is a dockerised web app for monitoring and managing your Monzo bank account.</p>

## V3 UPGRADE SWITCHES FROM MONGODB TO SQLITE3.

If you've been using this thusfar, please pin to v2 to continue using MongoDB. If you have the know how you can migrate data to SQLite, but i've found its easier just to start over

## Features

- Days to payday (with per day budget information)
- Dedicated spending chart
- Automatic payday pot dispersion
- Transaction logging
- None direct debit/standing order handling via pots

## Technology In Use

- [NestJS (Typescript)](https://docs.nestjs.com/)
- [React (Typescript)](https://reactjs.org/)
- [SQLite](https://www.sqlite.org/index.html)
- [Docker](https://www.docker.com/)

## Installation

You need to use [docker](https://docs.docker.com/get-started/), and I recommend using [docker compose](https://docs.docker.com/compose/) to spin up MonzoDash!

### Example docker-compose.yml

```bash
version: "3.4"

services:
  monzodash:
    image: ghcr.io/sasharyder/monzodash:latest
    restart: unless-stopped
    environment:
      - TZ=Europe/London
      - MONZO_CLIENT_ID=${MONZO_CLIENT_ID}
      - MONZO_CLIENT_SECRET=${MONZO_CLIENT_SECRET}
      - MONZODASH_DOMAIN=${MONZODASH_DOMAIN}
    volumes:
      - ./data:/data
```

Before doing this, create a `.env` file along side your `docker-compose.yml` file.

```bash
MONZO_CLIENT_ID=
MONZO_CLIENT_SECRET=
MONZODASH_DOMAIN=http://localhost
MONZODASH_WEBHOOK_DOMAIN=http://localhost #Optional: will fall back to MONZODASH_DOMAIN if not added
```

- You can get `MONZO_CLIENT_ID` and `MONZO_CLIENT_SECRET` from `https://developers.monzo.com/`
- Set `MONZODASH_DOMAIN` to `https://YOUR_DOMAIN` (Where you'll setup nginx ect to access the frontend, or access directly)
- Set `MONZO_WEBHOOK_URI` to `https://YOUR_WEBHOOK_DOMAIN` (not required if they're the same domain.)

## Usage

Once everything is setup and you've setup NGINX ect, just go to what you've set as `MONZODASH_DOMAIN` and you will be presented with a login screen!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
