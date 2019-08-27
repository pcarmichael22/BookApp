'use strict'

const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/test', (req, res) => {
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
            return new Book(bookData.volumeInfo.title,
                bookData.volumeInfo.authors[0],
                bookData.volumeInfo.description,
                bookData.volumeInfo.imageLinks.smallThumbnail,
                bookData.volumeInfo.pageCount,
                bookData.volumeInfo.infoLink,
                bookData.volumeInfo.averageRating);
        })
        res.render('./pages/searches/show', { myData: formattedBookList });
    }).catch(error => {
        res.render('./pages/error');
        console.error(error);
    })
};

// function newSearch(req, res) {
//     return res.render('/pages/searches/show');
// }

app.listen(PORT, () => console.log(`Up and running on ${PORT}`));


// book constructor

function Book(title, author, description, thumbnail, pagecount, link, rating) {
    this.title = title ? title : 'No Title Found';
    this.author = author ? author : 'No Author Found';
    this.description = description ? description : 'N/A';
    this.thumbnail = thumbnail ? thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
    this.pagecount = pagecount ? pagecount : 'No pagecount found';
    this.link = link ? link : 'No link found';
    this.rating = rating ? rating : 'No rating found';
};