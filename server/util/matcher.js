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

  matchByCategory(tree.search(range), data);

};

/******************** EXPORTED SCRIPT *********************/

module.exports = (rTree, callback) => {

  let results = [];

  fs.createReadStream(path.resolve(__dirname + '/../resources/Customers.csv'))
    .pipe(parse({columns: true}))
    .on('data', function(csvrow) {

      matchByDistance(rTree, csvrow);

    })
    .on('end',function() {
      for (var x = 0; x < 5; x++) {

      }
    });

};