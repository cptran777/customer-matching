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


# Solving the Problem

The goal of this project was to read two CSV files that had a detailed list of customers asking to have their items picked up and a detailed list of recipients at which the items could be dropped off and match customers to recipients using three primary criteria:

1) The recipient had to be within a 5 mile radius of the customer
2) The recipient had to accept items of the same category as the customer was delivering
3) The recipient had to be open during the pickup window in which the customer was promised

## Back End

Because the method of solving this problem contains a lot of independent, potentially asynchronous steps (such as writing to a db or reading from a CSV file), Node was chosen as the back end as its speed using async processes can outdo a backend in vanilla python.

Looking at the first criteria, we were given a latitude and longitude of the customers' and recipients' locations, so using the Haversine formula to calculate a distance between the two points would be a good way to calculate a 5 mile radius. However, if we were to have to calculate the distance between each customer and every possible recipient, there would be a ton of unnecessary calculations for points that are nowhere near our point of interest.

Enter spatial indexing and the R-Tree. Using an R-Tree, it is possible to search for points only within a given area in much faster than customers * recipients time (log M entries * n points time). Using an R-Tree library called R-Bush for node, we can prepopulate the recipients into the R Tree and then access this data structure when running through the customer list to search for a smaller estimated area around the customer location. 

Upon reducing our potential matches down to only those within the appropriate distance, we are given the categories of items the customers have and the categories of items the recipients can accept as integers representing binary numbers where each bit corresponds to a category of items. Using the bitwise AND operation, we can quickly create a match of customer bits to recipient bits. If the resulting bitwise match is the same integer as the customer, we know that the customer bits are contained within the recipient bits. Doing this for each potential match will reduce the matching recipients to only those who accept the same category of items.

Finally, we do a similar operation for the third step. JavaScript comes with a handy Date() object that can be used to strip the exact hour from a string of the time in iso 8601 format. Using the given hour and corresponding that to a bit match on the recipient, we narrow down the list to only matches that mee tall 3 criteria. 

These matches are written to a Postgres database to be later accessed by the front-end client. A relational database was chosen instead of a NoSQL database because of the ease to access items in a many-to-many relationship such as customer to recipient matches. 

## Front End

The front end is a simple React framework with Bootstrap for table styling that is wrapped together using the Webpack tool. The table is a generalized reusable component that simply takes in an array of headers and an array of data rows. The application makes an http call to the server to receive the data and then re renders the table components with the received data. 