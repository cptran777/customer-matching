'use strict'
// Initializes the database connection to be passed along to the server index file as a module

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://charlietran@localhost/matching';

const client = new pg.Client(connectionString);

module.exports = client;