'use strict'
// This file contains the function to read the recipient csv file and populate the r Tree

/******************* INIT DEPENDENCIES *********************/

let fs = require('fs');
let path = require('path');
let parse = require('csv-parse');
let db = require('../db/init');

/******************* HELPER FUNCTIONS **********************/

let createDbQuery = require('./lib').createDbQuery;
let idGenerator = require('./lib').idGenerator;
let toNumber = require('./lib').toNumber;

/********************* PRIMARY EXPORT **********************/

module.exports = (rTree, callback) => {

  let giveId = idGenerator(1);

  db.connect();

  fs.createReadStream(path.resolve(__dirname + '/../resources/Recipients.csv'))
    .pipe(parse({columns: true}))
    .on('data', function(csvrow) {

      let latitude = parseFloat(csvrow.Latitude);
      let longitude = parseFloat(csvrow.Longitude);


      csvrow.id = giveId();
      toNumber(csvrow, ['Restrictions', 'Latitude', 'Longitude', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

      // Insert into database
      createDbQuery('recipients', csvrow);

      csvrow.minX = longitude;
      csvrow.maxX = longitude;
      csvrow.minY = latitude;
      csvrow.maxY = latitude;

      rTree.insert(csvrow);
    })
    .on('end',function() {
      callback(rTree);
    });

};