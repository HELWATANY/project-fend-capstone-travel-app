# Travel App

## Extend Options:
[x] Cache countries list in the Localstorage
[x] Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
[x] Use Local Storage to save the data so that when they close, then revisit the page, their information is still there.
[x] Allow the user to remove the trip.

## Setting up the APIs
A `.env` file should be created with the following structure
```bash
GEONAMES_USER=genonames_api_username
WEATHERBIT_KEY=weatherbit_api_key
PIXABAY_KEY=pixabay_api_key
```


## Install Dependencies
``` bash
$ npm install
```

## Start Server
```bash
$ npm run start
```

## Build Project For Development Environment
```bash
$ npm run build-dev
```

## Build Project For Production Environment
```bash
$ npm run build-prod
```

## Run Jest Test
```bash
$ npm run test
```
