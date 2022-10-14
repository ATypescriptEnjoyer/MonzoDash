#!/bin/bash

echo "Running CMD $2 on $1 environment."

if [[ $2 = 'start' ]] 
then
    docker compose --env-file .env -f docker-compose.$1.yml up -d --build
elif [[ $2 = 'logs' ]]
then
    docker compose -f docker-compose.$1.yml logs -f
fi

