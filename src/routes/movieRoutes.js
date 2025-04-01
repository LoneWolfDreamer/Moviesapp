const express = require("express");
const router = express.Router();
const movieModel = require("../models/movieModel");
const db = require("../db");

// 🟢 Add a new movie
router.post("/add", (req, res) => {
    const { title, release_date, category_id } = req.body;

    if (!title || !release_date || !category_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    movieModel.createMovie(title, release_date, category_id, (err) => {
        if (err) return res.status(500).json({ message: "Error adding movie", error: err });
        res.json({ message: "Movie added successfully" });
    });
});

// 🟢 Get all movies
router.get("/", (req, res) => {
    movieModel.getAllMovies((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching movies", error: err });
        res.json(results);
    });
});

// 🟢 Get movies by category
router.get("/category/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;
    movieModel.getMoviesByCategory(categoryId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching movies", error: err });
        res.json(results);
    });
});

// 🟢 Update a movie
router.put("/:movieId", (req, res) => {
    const movieId = req.params.movieId;
    const { title, release_date, category_id } = req.body;

    movieModel.updateMovie(movieId, title, release_date, category_id, (err) => {
        if (err) return res.status(500).json({ message: "Error updating movie", error: err });
        res.json({ message: "Movie updated successfully" });
    });
});

// 🟢 Delete a movie
router.delete("/:movieId", (req, res) => {
    const movieId = req.params.movieId;
    movieModel.deleteMovie(movieId, (err) => {
        if (err) return res.status(500).json({ message: "Error deleting movie", error: err });
        res.json({ message: "Movie deleted successfully" });
    });
});

// 🟢 Get details of a specific movie
router.get("/:id", (req, res) => {
    const movieId = req.params.id;

    const movieQuery = `
        SELECT movies.*, GROUP_CONCAT(actors.name) AS actors
        FROM movies 
        LEFT JOIN movie_actors ON movies.id = movie_actors.movie_id
        LEFT JOIN actors ON movie_actors.actor_id = actors.id
        WHERE movies.id = ?;
    `;

    db.query(movieQuery, [movieId], (err, movieResult) => {
        if (err) return res.status(500).json({ message: "Error fetching movie details" });

        const reviewQuery = `SELECT * FROM reviews WHERE movie_id = ?`;
        db.query(reviewQuery, [movieId], (err, reviewResult) => {
            if (err) return res.status(500).json({ message: "Error fetching reviews" });
            res.json({ movie: movieResult[0], reviews: reviewResult });
        });
    });
});

// 🟢 Add a review to a movie
router.post("/:id/reviews", (req, res) => {
    const movieId = req.params.id;
    const { comment } = req.body;

    const insertQuery = `INSERT INTO reviews (movie_id, comment) VALUES (?, ?)`;

    db.query(insertQuery, [movieId, comment], (err) => {
        if (err) return res.status(500).json({ message: "Error adding review" });
        res.json({ message: "Review added successfully" });
    });
});

module.exports = router;