'use strict'

const express = require('express');
const superagent = require('superagent');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000

// app.get('/', newSearch);

// app.post('/book-search', searchForBook);

//route handlers

// function searchForBook(req, res) {
//     Res.send(req.body);
//     let url = `https://www.googleapis.com/books/v1/volumes?q=`
//     if (req.body.search[0] === 'title') {
//         const query = `+intitle:${title}`;
//         url = url + query;
//     } else {
//         const query = `+inauthor:${author}`;
//         url = url + query;
//     }

//     superagent.get(url)
//     Res.send(result.body);
// };


app.listen(PORT, () => console.log(`Up and running on ${PORT}`));