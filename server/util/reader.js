'use strict'
// This file contains the function to read the recipient csv file and populate the r Tree

/******************* INIT DEPENDENCIES *********************/

let fs = require('fs');
let path = require('path');
let parse = require('csv-parse');

const toNumber = (data, properties) => {
  
  for (let x = 0; x < properties.length; x++) {
    data[properties[x]] = Number(data[properties[x]]);
  }

};

const idGenerator = (start) => {

  let id = start;

  return () => {
    return id++;
  }
}

module.exports = (rTree, callback) => {

  let giveId = idGenerator(1);

  fs.createReadStream(path.resolve(__dirname + '/../resources/Recipients.csv'))
    .pipe(parse({columns: true}))
    .on('data', function(csvrow) {

      let latitude = parseFloat(csvrow.Latitude);
      let longitude = parseFloat(csvrow.Longitude);

      csvrow.minX = longitude;
      csvrow.maxX = longitude;
      csvrow.minY = latitude;
      csvrow.maxY = latitude;

      csvrow.id = giveId();
      toNumber(csvrow, ['Restrictions', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      rTree.insert(csvrow);
    })
    .on('end',function() {
      callback(rTree);
    });

};