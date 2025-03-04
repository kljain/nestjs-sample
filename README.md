# Fetcher

## Description

This project is built using [NestJS](https://github.com/nestjs/nest).

## Installation

```bash
npm install
```

## Environment variables

To run the app, you will need to load the appropriate .env file.

1. Create a `.env.pass.dev` file in the `./env` directory.
2. Paste the dev password that you have received into this file and save it.
3. Run `npm run env:toDev` which will decode the `./env/dev.env` file and place it in `./.env`

## Running the app

### Dev mode

```bash
npm run start:dev
```

## Tests

**We're not currently using tests**, but here are the commands:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
