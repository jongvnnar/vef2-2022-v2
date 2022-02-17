-- Útfæra schema
CREATE TABLE IF NOT EXISTS events(
  id serial primary key,
  name varchar(64) not NULL,
  slug varchar(64) not NULL unique,
  description varchar(400),
  created timestamp with time zone not NULL default current_timestamp,
  updated timestamp with time zone not NULL default current_timestamp
);

CREATE TABLE IF NOT EXISTS bookings(
  id serial primary key,
  name varchar(64) not NULL,
  description varchar(400),
  event integer not NULL,
  created timestamp with time zone not NULL default current_timestamp,
  foreign key(event) references events(id)
);

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username varchar(64) not NULL unique,
  password varchar(256) not NULL
);
