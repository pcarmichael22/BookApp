DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
 id SERIAL PRIMARY KEY,
 title VARCHAR(255),
 author VARCHAR(255),
 description VARCHAR,
 thumbnail VARCHAR(255),
 pagecount NUMERIC(5),
 infolink VARCHAR(255),
 rating VARCHAR(255)
);