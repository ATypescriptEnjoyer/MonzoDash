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

You need to use [docker](https://docs.docker.com/get-started/) and [docker compose](https://docs.docker.com/compose/) to spin up MonzoDash!

```bash
cd api/
docker compose up -d
#Don't worry! This will spin  up everything, we do it inside /api to use it's .env file :)
```

Before doing this, configure api/.env.example!

- You can get `MONZO_CLIENT_ID` and `MONZO_CLIENT_SECRET` from `https://developers.monzo.com/`
- Set `MONZODASH_DOMAIN` to `https://YOUR_DOMAIN`
- Set `MONZO_WEBHOOK_URI` to `https://YOUR_WEBHOOK_DOMAIN`

```
MONGO_USERNAME=monzodash
MONGO_PASSWORD=monzodash
MONGO_HOST=mongo
REDIS_URL=redis://redis
MONZO_CLIENT_ID=
MONZO_CLIENT_SECRET=
MONZODASH_DOMAIN=http://localhost:5000
MONZODASH_WEBHOOK_DOMAIN=http://localhost:5000
```

## Usage

Once everything is setup and you've setup NGINX ect, just go to what you've set as `MONZODASH_DOMAIN` and you will be presented with a login screen!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
