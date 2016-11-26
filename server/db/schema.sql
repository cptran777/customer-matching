DROP DATABASE IF EXISTS matching;
CREATE DATABASE matching;

\c matching;

CREATE TABLE recipients (
  id int not null primary key,
  FirstName text,
  LastName text,
  Street text,
  City text,
  State text,
  Postal text,
  Country text,
  Email text,
  Phone text,
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
  FirstName text,
  LastName text,
  Street text,
  City text,
  State text,
  Postal text,
  Country text,
  Email text,
  Phone text,
  Latitude numeric,
  Longitude numeric,
  Categories int,
  PickupAt text,
  TimeZoneId text
);

CREATE TABLE recipients_customers (
  id serial not null primary key,
  recipient int not null,
  customer int not null
);