DROP TABLE IF EXISTS books;

CREATE TABLE books (
 id SERIAL PRIMARY KEY,
 title VARCHAR(255),
 author VARCHAR(255),
 description VARCHAR,
 thumbnail VARCHAR(255),
 isbn VARCHAR(255),
 bookshelf VARCHAR(255)
);

INSERT INTO books (
  author,
  title,
  description,
  thumbnail,
  isbn,
  bookshelf
) VALUES (
  'Frank Herbert',
  'Dune',
  'Follows the adventures of Paul Atreides, the son of a betrayed duke given up for dead on a treacherous desert planet and adopted by its fierce, nomadic people, who help him unravel his most unexpected destiny.',
  'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
  '1010101010101',
  'Scifi'
);



