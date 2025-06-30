# weather-loader-component-arq2

Service for 'Arquitectura de Software II' signature S12025

## Stack

Using this technologies:

- Nodejs 24.3.0
- Typescript 5.4
- Express 4.19
- Jest 29.7
- OvernightJS 1.7
- MongoDB (Mongoose 8.2)

## Develop environment

- Change name file **.env.example** to **.env**

- Run `npm install` to get the dependencies installed.

- Run `docker compose -p wlc-app up -d --force-recreate` to get images and create containers.

### Let's go!

- Service:
  - Server: http://localhost:8080/api/temperature
- Mongo client web: http://localhost:8081
  - User: admin
  - Password: pass

### Grafana

- Go to folder **docker/grafana** then run ```docker compose up -d grafana --force-recreate``` to up docker container

- You can to access on: http://localhost:4000

### Prometheus

- Go to folder **docker/prometheus** then run ```docker compose up -d prometheus --force-recreate``` to up docker container

- You can to access on: http://localhost:9090

### Loki

- Go to folder **docker/loki** then run ```docker compose up -d loki --force-recreate``` to up docker container


Enjoy , thanks!