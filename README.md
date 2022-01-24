# MonzoMation
IFTTT automation for Monzo, without needing to give a 3rd party your banking data.

## Requirements

The requires so far are very basic:

 - NodeJS
 - Postgres, i'm using Docker for a Postgres server.

Rename `.env.example` to `.env` and `docker compose up -d` should be successful, or `docker-compose up -d` if you're not using Docker Compose V2.