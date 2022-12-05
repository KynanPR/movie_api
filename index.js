const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.log'), {flags: 'a'});

let movies = [
    {
        name: 'Good Will Hunting',
        releaseYear: '1998',
    },
    {
        name: 'Pitch Perfect',
        releaseYear: '2012',
    },
    {
        name: 'I don\'t watch that many films',
        releaseYear: '1999',
    },
    {
        name: 'I don\'t watch that many films: Part 2 Electric Boogaloo',
        releaseYear: '1999+1',
    },
    {
        name: 'The Room',
        releaseYear: '2009',
    },
    {
        name: 'Emoji Movie',
        releaseYear: '2017',
    },
    {
        name: 'Cats',
        releaseYear: '2019',
    },
    {
        name: 'The Arrival of a Train',
        releaseYear: '1896',
    },
    {
        name: 'Pitch Perfect 2',
        releaseYear: '2015',
    },
    {
        name: 'This was the hardest part of this excercise',
        releaseYear: '2022',
    },
];

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.send('Movies API');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root:__dirname});
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Borked!');
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});