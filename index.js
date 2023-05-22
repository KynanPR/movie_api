// Modules
const express = require('express'),
    bodyParser = require('body-parser');
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

// Connect Mongoose to db
mongoose.connect(
    'mongodb://localhost:27017/movies',
    {useNewUrlParser: true, useUnifiedTopology: true, family: 4}
    );

// Import Mongoose models
const app = express(),
    Movies = Models.Movie,
    Users = Models.User;

// Init body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.log'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
    res.sendFile('public/index.html', {root: __dirname});
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root:__dirname});
});

app.get('/data/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        let moviesList = []
        movies.forEach(movie => {
            moviesList.push(movie.Title)
        });
        res.status(200).json(moviesList);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/data/movies/:title', (req, res) => {
    res.send(req.params.title + '.json');
});

app.get('/data/genres/:genre', (req, res) => {
    res.send(req.params.genre + '.json');
});

app.get('/data/directors/:director', (req, res) => {
    res.send(req.params.director + '.json');
});

app.post('/users/register', (req, res) => {
    res.send('Registering!');
});

app.post('/users/login/:username', (req, res) => {
    res.send(req.params.username + '.json');
});

app.get('/users/:username', (req, res) => {
    res.send(req.params.username + '.json');
});

app.put('/users/:username', (req, res) => {
    res.send(req.params.username + '.json updated');
});

app.post('/users/:username/favorites/:movieId', (req, res) => {
    res.send(req.params.username + '_fav.json - ' + req.params.movieId + ' added');
});

app.delete('/users/:username/favorites/:movieId', (req, res) => {
    res.send(req.params.username + '_fav.json - ' + req.params.movieId + ' removed');
});

app.delete('/users/:username', (req, res) => {
    res.send(req.params.username + ' deleted');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Borked!');
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});