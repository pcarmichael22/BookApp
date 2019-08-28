DROP TABLE IF EXISTS books;

CREATE TABLE books (
 id SERIAL PRIMARY KEY,
 title VARCHAR(255),
 author VARCHAR(255),
 description VARCHAR,
 isbn NUMERIC(13),
 thumbnail VARCHAR(255),
 pagecount NUMERIC(5),
 infolink VARCHAR(255),
 rating VARCHAR(255),
 genre VARCHAR(255)
);