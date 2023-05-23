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

// Setup Logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.log'), {flags: 'a'});

// Logging
app.use(morgan('combined', {stream: accessLogStream}));


// Endpoints and handling functions

// Home/Index
app.get('/', (req, res) => {
    res.sendFile('public/index.html', {root: __dirname});
});

// Documentation
app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root:__dirname});
});

// All movies
app.get('/movies', (req, res) => {
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

// Movie 
app.get('/movies/:title', (req, res) => {
    Movies.findOne({Title: req.params.title})
    .then((movie) => {
        res.status(200).json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Genre
    Movies.find({'Genre.Name': req.params.genre})
    .then((movies) => {
        if (!movies) {
app.get('/movies/genres/:genre', (req, res) => {
            res.status(400).send(
                'There are no movies in the database with the genre - ' + req.params.genre
            )
        } else {
            res.status(200).json(movies);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Director
    Movies.find({'Director.Name': req.params.director})
    .then((movies) => {
        if (!movies) {
app.get('/movies/directors/:director', (req, res) => {
            res.status(400).send(
                'There are no movies in the database with the director - ' + req.params.genre
            )
        } else {
            res.status(200).json(movies);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Register
app.post('/users', (req, res) => {
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user)})
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            })
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Login
app.post('/users/login/:username', (req, res) => {
    res.send(req.params.username + '.json');
});

// User Info
app.get('/users/:username', (req, res) => {
    Users.findOne({Username: req.params.username})
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Update User
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.username},
        {$set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        {new: true}
    )
    .then((updatedUser) => {
        res.status(200).json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Favorites Add
app.post('/users/:username/favorites/:movieId', (req, res) => {
    Users.findOneAndUpdate(
        {Username: req.params.username},
        {
            $push: {FavoriteMovies: req.params.movieId}
        },
        {new: true}
    )
    .then((updatedUser) => {
        res.status(200).json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Favourites Remove
app.delete('/users/:username/favorites/:movieId', (req, res) => {
    Users.findOneAndUpdate(
        {Username: req.params.username},
        {
            $pull: {FavoriteMovies: req.params.movieId}
        },
        {new: true}
    )
    .then((updatedUser) => {
        res.status(200).json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    }); 
});

// Deregister
app.delete('/users/:username', (req, res) => {
    Users.findOneAndRemove({Username: req.params.username})
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found');
            } else {
                res.status(200).send(req.params.username + ' was deleted');
            }
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.use(express.static('public'));

// General error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Borked!');
});

app.listen(8080, () => {
    console.log('App listening on port 8080');
});