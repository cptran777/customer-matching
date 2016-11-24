'use strict'
// Initializes the database connection to be passed along to the server index file as a module

let mysql = require('mysql');

module.exports = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'zochar',
  database: 'chat'
});