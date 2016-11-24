'use strict'
// This file reads the customers csv file and matches them up to the recipients previously read

/******************* INIT DEPENDENCIES *********************/

let fs = require('fs');
let path = require('path');
let parse = require('csv-parse');

/******************** HELPER FUNCTIONS *********************/

const getDayAsString = (day) => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
}

// Since the recipient time is expressed as a bit with 8am being the 0th bit
// this will help the customer time match up with that
const timeAsBit = (time) => {
  return Math.pow(2, time - 8);
};

// Creates a self imposed Id so that we can set the primary key in the database and keep track
// of it here without having to make an additional db call
// Note, this code is not DRY, as it appears in reader as well. Probably will move after everything
// else is done
const idGenerator = (start) => {

  let id = start;

  return () => {
    return id++;
  }

}

// Helpers for the getDistance function:
const squared = (num) => {
  return Math.pow(num, 2);
}

const radians = (deg) => {
  return deg * Math.PI / 180;
}

// Solves for distance based on the haversine formula and returns result
const getDistance = (lon1, lat1, lon2, lat2) => {

  // Earth's radius in miles
  const radius = 3959;

  // Turn all degree values to radians:
  let rLon1 = radians(lon1);
  let rLat1 = radians(lat1);
  let rLon2 = radians(lon2);
  let rLat2 = radians(lat2);

  return 2 * radius * Math.asin(Math.sqrt(
    squared(Math.sin((rLat2 - rLat1) / 2)) + Math.cos(rLat2) * Math.cos(rLat1) * squared(Math.sin((rLon2 - rLon1) / 2))
    ));

};

/******************** MAIN FUNCTIONS **********************/

// Final filter, after matching by category will match if time syncs up with 
// the customer
const matchByTime = (recipients, customer) => {

  let results = [];

  let d = new Date(customer.PickupAt)
  let pickupDay = getDayAsString(d.getDay());
  let pickupTime = timeAsBit(d.getHours());

  for (let j = 0; j < recipients.length; j++) {
    if ((pickupTime & recipients[j][pickupDay]) === pickupTime) {
      results.push(recipients[j]);
    }
  }

  // TODO: Put results into database

};

// Takes matched list by distances and reduces it further by filtering
// for categories
const matchByCategory = (recipients, customer) => {

  let results = [];

  for (let i = 0; i < recipients.length; i++) {

    let category = Number(customer.Categories);

    if ((category & recipients[i].Restrictions) === category) {
      results.push(recipients[i]);
    }

  }

  matchByTime(results, customer);
};

// First match that gets performed in the main export function
const matchByDistance = (tree, data) => {

  let latitude = parseFloat(data.Latitude);
  let longitude = parseFloat(data.Longitude);

  let range = {
    minX: longitude - 0.095,
    maxX: longitude + 0.095,
    minY: latitude - 0.075,
    maxY: latitude + 0.075
  }

  let results = [];
  let area = tree.search(range);

  for (let k = 0; k < area.length; k++) {
    if (getDistance(longitude, latitude, area[k].Longitude, area[k].Latitude) <= 5) {
      results.push(area[k]);
    }
  }

  matchByCategory(tree.search(range), data);

};

/******************** EXPORTED SCRIPT *********************/

module.exports = (rTree, callback) => {

  let results = [];
  let getId = idGenerator(1);

  fs.createReadStream(path.resolve(__dirname + '/../resources/Customers.csv'))
    .pipe(parse({columns: true}))
    .on('data', function(csvrow) {

      csvrow.id = getId();
      matchByDistance(rTree, csvrow);

    })
    .on('end', function() {
      for (var x = 0; x < 5; x++) {

      }
    });

};