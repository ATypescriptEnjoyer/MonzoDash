#!/bin/bash

docker compose --env-file .env -f docker-compose.$1.yml  up -d --build