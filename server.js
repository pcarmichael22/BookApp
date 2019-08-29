'use strict'

// PACKAGES ///////////

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const methodOverride = require('method-override');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;


// POSTGRESQL /////////

const client = new pg.Client(DATABASE_URL);
client.connect();
client.on('error', (error) => console.error(error));

// MIDDLEWARE //////////

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride((request, response) => {
    if (request.body && typeof request.body === 'object' && '_method' in request.body) {
        let method = request.body._method;
        delete request.body._method;
        return method;
    }
}))

//// ROUTES ////////////

app.get('/', getAllBooks);
app.get('/book-search', newSearch);
app.post('/book-search', searchForBook);
app.post('/book/save', saveBook);
app.get('/books/:book_id', showSingleBook);

// refactor .post to delete

app.post('/books/:book_id', deleteBook);

// FUNCTIONS ///////////

function getAllBooks(req, res) {
    console.log(process.env.DATABASE_URL)
    console.log('about to select all books')
    const SQL = `SELECT * FROM books;`
    client.query(SQL)
        .then((sqlResponse) => {
            console.log(sqlResponse.rows);
            res.render('pages/index', { results: sqlResponse.rows });
        }).catch(error => {
            res.render('./pages/error');
            console.error(error);
        })
}

function newSearch(request, response) {
    response.render('./pages/searches/new');
}

function searchForBook(req, res) {
    // use names (title or author), not ordinals
    console.log(req)
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

    superagent.get(bookUrl).then(result => {
        // console.log(result.body.items);
        const bookList = result.body.items;
        const myData = bookList.map(bookData => {
                const regex = /(http)/g;
                return new Book(bookData.volumeInfo.title,
                    bookData.volumeInfo.authors && bookData.volumeInfo.authors[0],
                    bookData.volumeInfo.description,
                    bookData.volumeInfo.imageLinks.smallThumbnail.replace(regex, 'https'),
                );
            })
            // console.log(formattedBookList[0].isbn)
        res.render('./pages/searches/show', { myData });
    }).catch(error => {
        res.render('./pages/error');
        console.error(error);
    })
};

// book constructor

function Book(title, author, description, thumbnail) {
    this.title = title ? title : 'No Title Found';
    this.author = author ? author : 'No Author Found';
    this.description = description ? description : 'N/A';
    this.thumbnail = thumbnail ? thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
};


function saveBook(req, res) {
    client.query('INSERT INTO books (title, bookshelf) VALUES ($1, $2)', [req.body.title, req.body.category]).then(() => {
        res.redirect('/');
    })
}

function showSingleBook(req, res) {
    client.query('SELECT * FROM books WHERE id = $1', [req.params.book_id]).then(sqlResult => {
        // check that there is a valid result, show not found if not a valid result
        res.render('./pages/books/detail', { specificBook: sqlResult.rows[0] })
    })
}

function deleteBook(req, res) {
    const id = req.params.book_id;
    client.query('DELETE * FROM books WHERE id = $1', [id]).then(() => {
        res.redirect('/');
    })
}

app.listen(PORT, () => console.log(`Up and running on ${PORT}`));