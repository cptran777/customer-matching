'use strict'

console.log('Starting server...');

/******************* INIT DEPENDENCIES *********************/

// Main server dependencies
let express = require('express');
let path = require('path');
let bodyparser = require('body-parser');

// Project related dependencies
let rbush = require('rbush');
let reader = require('./util/reader');

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

reader();

/*
ALGORITHM FOR MATCHING

- First go for the spatial match using the R-Tree
  - Since the limit is 5 miles, and each degree of latitude/longitude is approx 69 miles, a 5 mile unit
    is approx. 1/14 of a latitude degree, which comes out to about .072 as an upper bound. Adding this to
    the x and y coords of a point will give an appropriate estimate box to calculate further with the 
    haversine formula
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