CREATE DATABASE matching;

USE matching;

CREATE TABLE recipients (
  id int not null primary key,
  name char(25)
);

CREATE TABLE customers (
  id int not null primary key,
  message char(100),
  roomname char(25)
);

CREATE TABLE recipients_customers (
  id int not null primary key,
  recipient int not null,
  customer int not null
);