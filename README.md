# customer-matching
Matching incoming customers with possible recipients for deliveries

# Setup

The application uses a PostgreSQL database, meaning that Postgres should be installed separately on the machine. The `init.js` file in server/db accesses a Postgres database using environment variables. As the .env file has been git ignored for security reasons, an .env file should be created with your own Postgres database and credentials to test locally.

To get the database started, run `$ psgl -f server/db/schema.sql` to set up the initial database schema. Do this before starting the server. 