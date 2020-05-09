// Set DotEnv
const dotenv = require('dotenv')
dotenv.config()

// Set Path
const path = require('path')

// Set IP
const ip = require('ip')

// Setup API mockup
const mockAPIResponse = require('./mockAPI.js')

// Setup Aylien SDK
const aylien = require('aylien_textapi')
let textapi = new aylien({
    application_id: process.env.API_ID,
    application_key: process.env.API_KEY
})


/**
 * INIT SERVER
 */
// Require Express to run server and routes
const express = require('express')

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
const port = 3000

// Setup Server
const server = app.listen(port, listening)


/**
 * ROUTES
 */
app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})


/**
 * CALLBACK FUNCTIONS
 */
// Server callback debug function
function listening() {
    console.log('Website running at:')
    console.log(`  - Local: http://localhost:${port}`)
    console.log(`  - Network: http://${ip.address()}:${port}`)
}
