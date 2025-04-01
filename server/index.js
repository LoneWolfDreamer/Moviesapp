const express = require('express');
const db = require('./db'); // Import database connection
const app = express();
const port = 4000;
require('dotenv').config();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to the Movie Database!');
});

// Movies Route
app.get('/movies', (req, res) => {
    res.render('movies'); // Render movies.ejs from the views folder
});

// Movie Details Route
app.get('/movies/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const [movie] = await db.query('SELECT * FROM movies WHERE id = ?', [movieId]);
        const [genres] = await db.query(`
            SELECT genre_name 
            FROM genres 
            JOIN movie_genres ON genres.id = movie_genres.genre_id 
            WHERE movie_id = ?`, [movieId]);
        const [actors] = await db.query(`
            SELECT actor_name 
            FROM actors 
            JOIN movie_actors ON actors.id = movie_actors.actor_id 
            WHERE movie_id = ?`, [movieId]);

        res.render('movie', { movie: movie[0], genres, actors });
    } catch (err) {
        res.status(500).send('Error fetching movie data');
        console.error(err);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
