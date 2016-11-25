'use strict'


/******************* INIT DEPENDENCIES *********************/

let db = require('../db/init');

/********************* FUNCTIONS LIST **********************/

// idGenerator creates a unique autoincrementing id based on a starting point
// Useful for manually tracking items to be added to db that are also stored elsewhere
const idGenerator = (start) => {

  let id = start;

  return () => {
    return id++;
  }
}

const toNumber = (data, properties) => {
  
  for (let x = 0; x < properties.length; x++) {
    data[properties[x]] = Number(data[properties[x]]);
  }

};

// Takes a data object and creates a database query to add all the properties
// of that object to the table
const createDbQuery = (table, data) => {

  // queryString is held as an array but then can be joined to become the string
  let queryString = [];
  let queryItems = [];
  let queryValue = [];

  let propCount = 1;

  for (let prop in data) {
    queryString.push(prop);
    queryItems.push(data[prop]);
    queryValue.push('$' + propCount++);
  }

  queryString = 'INSERT INTO ' + table + '(' + queryString.join(', ') + ') VALUES(' +
    queryValue.join(', ') + ')';

  db.query(queryString, queryItems);

  // db.connect((err) => {

  //   if (err) throw err;

  //   db.query(queryString, queryItems, (err, result) => {

  //     if (err) throw err;
  //     console.log('test insert: ', result.rows[0]);

  //     db.end((err) => {
  //       if (err) throw err;
  //     });

  //   });

  // });
};

/****************** CONSOLIDATED EXPORT ********************/

module.exports = {
  createDbQuery,
  idGenerator,
  toNumber
};