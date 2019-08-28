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

app.get('/', getBooks);
app.get('/book-search', newSearch);
app.post('/book-search', searchForBook);

// route handlers

function newSearch(request, response) {
    return response.render('./pages/searches/new');
}

function getBooks(req, res) {
    const SQL = `SELECT * FROM books;`
    return client.query(SQL)
        .then((results) => {
            res.render('pages/index', { results });
        })
}

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
                bookData.volumeInfo.authors && bookData.volumeInfo.authors[0],
                bookData.volumeInfo.description,
                bookData.volumeInfo.imageLinks.smallThumbnail.replace(regex, 'https'),
            );
        })
        console.log(formattedBookList[0].isbn)
        res.render('./pages/searches/show', { myData: formattedBookList });
    }).catch(error => {
        res.render('./pages/error');
        console.error(error);
    })
};

app.listen(PORT, () => console.log(`Up and running on ${PORT}`));

// book constructor

function Book(title, author, description, thumbnail) {
    this.title = title ? title : 'No Title Found';
    this.author = author ? author : 'No Author Found';
    this.description = description ? description : 'N/A';
    this.thumbnail = thumbnail ? thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
};


function saveToSql(req, res) {
    //Logging data into the SQL DB
    formattedBookList.forEach(eachBook => {
        const sqlQueryInsert = `
INSERT INTO books (title, author, description, thumbnail,)
VALUES ($1, $2, $3, $4);`;
        const valuesArray = [eachBook.title, eachBook.author, eachBook.description, eachBook.thumbnail];
        //client.query takes in a string and array
        client.query(sqlQueryInsert, valuesArray);
    })
}