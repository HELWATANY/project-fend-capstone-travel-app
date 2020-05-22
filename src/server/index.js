// Set DotEnv
const dotenv = require('dotenv');
dotenv.config();

// Set Path
const path = require('path');

// Set IP
const ip = require('ip');

// Fetch
const fetch = require("node-fetch");

// Setup API mockup
// const mockAPIResponse = require('./mockAPI.js')

// Setup Geonames SDK
const Geonames = require('geonames.js');
const geonames = new Geonames({
    username: process.env.GEONAMES_USER,
    lan: 'en',
    encoding: 'JSON'
});


/**
 * INIT SERVER
 */
// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express()

/** Middlewares **/
// Configure body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors())

// Initialize the dist directory
app.use(express.static('dist'))

// Setup Server Port
const port = 8081

// Setup Server
const server = app.listen(port, listening)


/**
 * ROUTES
 */
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
});

app.get('/test', function (req, res) {
    res.send({
        msg: 'hi'
    })
})

app.get('/countries', handleGetCountries);

app.post('/cities', handleGetCountryCities);

app.post('/weather', handleGetCityWeather);

app.post('/image', handleSearchImage);


/**
 * CALLBACK FUNCTIONS
 */
// Server callback debug function
function listening() {
    console.log('Website running at:')
    console.log(`  - Local: http://localhost:${port}`)
    console.log(`  - Network: http://${ip.address()}:${port}`)
}

// Get countries callback
async function handleGetCountries(req, res) {
    try {
        const countries = await geonames.countryInfo({}); //get continents
        res.status(200).send(countries);
    } catch(err) {
        res.status(400).send('Failed to connect to Geonames remote server');
        console.error(err);
    }
}

// Get cities by country geonameId
async function handleGetCountryCities(req, res) {
    try {
        const { id } = req.body
        const cities = await geonames.children({
            geonameId: id
        });
        res.status(200).send(cities);
    } catch(err) {
        res.status(400).send('Failed to connect to Geonames remote server');
        console.error(err);
    }
}

// Get weather by lat, lng
async function handleGetCityWeather(req, res) {
    const key = process.env.WEATHERBIT_KEY;
    try {
        const { lat, lon } = req.body
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
        const response = await fetch(url);
        const json = await response.json();
        res.status(200).send(json);
    } catch(err) {
        res.status(400).send('Failed to connect to Weatherbit remote server');
        console.error(err);
    }
}

// Get weather by lat, lng
async function handleSearchImage(req, res) {
    const key = process.env.PIXABAY_KEY;
    try {
        const { q } = req.body
        const url = `https://pixabay.com/api/?key=${key}&q=${q}`;
        const response = await fetch(url);
        const json = await response.json();
        res.status(200).send(json);
    } catch(err) {
        res.status(400).send('Failed to connect to Pixabay remote server');
        console.error(err);
    }
}
