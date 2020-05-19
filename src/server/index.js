// Set DotEnv
const dotenv = require('dotenv');
dotenv.config();

// Set Path
const path = require('path');

// Set IP
const ip = require('ip');

// Setup API mockup
// const mockAPIResponse = require('./mockAPI.js')

// Setup Geonames SDK
const Geonames = require('geonames.js');
const geonames = new Geonames({
    username: process.env.USERNAME,
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
async function handleGetCountries(res) {
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
