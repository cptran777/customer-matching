'use strict'

console.log('Starting server...');

/******************* INIT DEPENDENCIES *********************/

// Main server dependencies
let express = require('express');
let path = require('path');
let bodyparser = require('body-parser');
require('dotenv').config();

// Project related dependencies
let rbush = require('rbush');
let reader = require('./util/reader');
let matcher = require('./util/matcher');

/******************* INIT MIDDLEWARE ***********************/

let app = express();
app.use(express.static(__dirname + '/../client/public'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyparser.json());

/********************* INIT R TREE *************************/

let rTree = rbush();

reader(rTree, (tree) => {
  matcher(tree);
});

/*
ALGORITHM FOR MATCHING

- First go for the spatial match using the R-Tree
  - Parameters to pass to the search:
    - Since latitude and longitude distances vary by geolocation, the best way to set the parameters is
      by rough estimation:
      Each degree of latitude is approx 69 miles regardless of geolocation
      By this we can estimate that 5 miles is approximately 1/14 of a degree, or 0.071, or rounding to 0.075
      for a boundary we can get everything in the Y bound for an estimated box
      For Longitude, 1 deg of longitude = cos(latitude) * length of miles at equator, since most of 
      the items are at approx 37 latitude, 1 deg of longitude here is about 55 miles. 5 miles is 1/11
      or so of a degree, which is about 0.091, so 0.095 is a good boundary for our x values
  - Within each space, use Haversine formula to ensure proper distance matching
  - Will return with a list of initially eligible locations by distance

- For each eligible location by distance, test category of customer vs recipients
  - *Note: Recipient category must include customer category, but can be a larger set
    - Therefore, test whether customer category is include in recipient category
    - Test using bitwise & operator and testing if equal to customer category
  - Will return a list of eligible locations by distance AND food category

- For each eligible location by distance AND food category, test whether pickup times match up
  - Bitwise operators are quick constant time operations, so need a function to convert pickup time
    to a bit number and a day
  - Compare that bit number using bitwise & to find if it is contained within the recipient bit number
    for that day
  - Will return a final list of matches, if any
*/

/********************* INIT ROUTES *************************/

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/public/index.html'));
});

/********************* INIT SERVER *************************/

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log('Listening on port', port);
});