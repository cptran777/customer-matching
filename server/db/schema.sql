DROP DATABASE IF EXISTS matching;
CREATE DATABASE matching;

\c matching;

CREATE TABLE recipients (
  id int not null primary key,
  FirstName char(25),
  LastName char(25),
  Street char(100),
  City char(25),
  State char(25),
  Postal char(10),
  Country char(10),
  Email char(50),
  Phone char(25),
  Latitude numeric,
  Longitude numeric,
  Restrictions int,
  Sunday int,
  Monday int,
  Tuesday int,
  Wednesday int,
  Thursday int,
  Friday int,
  Saturday int
);

CREATE TABLE customers (
  id int not null primary key,
  FirstName char(25),
  LastName char(25),
  Street char(100),
  City char(25),
  State char(25),
  Postal char(10),
  Country char(10),
  Email char(50),
  Phone char(25),
  Latitude numeric,
  Longitude numeric,
  Categories int,
  PickupAt char(50),
  TimeZoneId char(25)
);

CREATE TABLE recipients_customers (
  id serial not null primary key,
  recipient int not null,
  customer int not null
);