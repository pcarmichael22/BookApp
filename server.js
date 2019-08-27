'use strict'

const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.get('/', (req, res) => {
    return res.render('./pages/index');
});

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

// function newSearch(req, res) {
//     return res.render('/pages/index');
// }

app.listen(PORT, () => console.log(`Up and running on ${PORT}`));