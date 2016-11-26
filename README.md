# customer-matching
Matching incoming customers with possible recipients for deliveries

# Setup

## Postgres

The application uses a PostgreSQL database, meaning that Postgres should be installed separately on the machine. The `init.js` file in server/db accesses a Postgres database using environment variables. As the .env file has been git ignored for security reasons, an .env file should be created with your own Postgres database and credentials to test locally.

To get the database started, run `$ psgl -f server/db/schema.sql` to set up the initial database schema. Do this before starting the server. 

## Webpack

The application uses webpack to package the react components into a single script file to be run from the client. Webpack should be installed globally using `npm install -g webpack`

## Installing Dependencies

Dependencies should be installed using `npm install` which should just refer to the package.json file for all necessary dependencies

## Starting the Server

`node server/index.js`