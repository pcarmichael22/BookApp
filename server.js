'use strict'

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

// Connect to database
const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', (error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/', (req, res) => {
    return res.render('./pages/index');
});

app.post('/book-search', searchForBook);

// route handlers

function searchForBook(req, res) {
    const searchType = req.body.search[0];
    const searchingFor = req.body.search[1];
    let bookUrl = `https://www.googleapis.com/books/v1/volumes?q=`
    if (searchType === 'title') {
        const query = `+intitle:${searchingFor}`;
        bookUrl = bookUrl + query;
    } else {
        const query = `+inauthor:${searchingFor}`;
        bookUrl = bookUrl + query;
    }
    console.log(bookUrl);

    superagent.get(bookUrl).then(result => {
        // console.log(result.body.items);
        const bookList = result.body.items;

        const formattedBookList = bookList.map(bookData => {
            const regex = /(http)/g;
            return new Book(bookData.volumeInfo.title,
                bookData.volumeInfo.authors[0],
                bookData.volumeInfo.description,
                bookData.volumeInfo.industryIdentifiers[0].identifier,
                bookData.volumeInfo.imageLinks.smallThumbnail.replace(regex, 'https'),
                bookData.volumeInfo.pageCount,
                bookData.volumeInfo.infoLink,
                bookData.volumeInfo.averageRating);
        })
        res.render('./pages/searches/show', { myData: formattedBookList });
        //Logging data into the SQL DB
        formattedBookList.forEach(eachBook => {
            const sqlQueryInsert = `
   INSERT INTO books (title, author, description, isbn, thumbnail, pagecount, infolink, rating)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
            const valuesArray = [eachBook.title, eachBook.author, eachBook.description, eachBook.isbn, eachBook.thumbnail, eachBook.pagecount, eachBook.link, eachBook.rating];
            //client.query takes in a string and array
            client.query(sqlQueryInsert, valuesArray);
        })
    }).catch(error => {
        res.render('./pages/error');
        console.error(error);
    })
};

app.listen(PORT, () => console.log(`Up and running on ${PORT}`));

// book constructor

function Book(title, author, description, isbn, thumbnail, pagecount, link, rating) {
    this.title = title ? title : 'No Title Found';
    this.author = author ? author : 'No Author Found';
    this.description = description ? description : 'N/A';
    this.isbn = isbn ? isbn : 'N/A';
    this.thumbnail = thumbnail ? thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
    this.pagecount = pagecount ? pagecount : 'No pagecount found';
    this.link = link ? link : 'No link found';
    this.rating = rating ? rating : 'No rating found';
};