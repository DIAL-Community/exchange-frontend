#!/bin/bash

cd "$(dirname "$0")"

docker-compose up --build -d
docker-compose exec -w /t4d/app web rails db:fixtures:load
