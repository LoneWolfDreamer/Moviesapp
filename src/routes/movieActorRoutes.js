// src/routes/movieActorRoutes.js
const express = require('express');
const movieActorModel = require('../models/movieActorModel');
const router = express.Router();

// Assign an actor to a movie (many-to-many relationship)
router.post('/assign', (req, res) => {
    const { movie_id, actor_id } = req.body;

    if (!movie_id || !actor_id) {
        return res.status(400).json({ message: "Movie ID and Actor ID are required" });
    }

    movieActorModel.assignActorToMovie(movie_id, actor_id, (err) => {
        if (err) return res.status(500).json({ message: "Error assigning actor to movie", error: err });
        res.json({ message: "Actor assigned to movie successfully" });
    });
});

// Get all actors for a specific movie
router.get('/actors/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    movieActorModel.getActorsByMovie(movieId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching actors for movie", error: err });
        res.json(results);
    });
});

// Get all movies for a specific actor
router.get('/movies/:actorId', (req, res) => {
    const actorId = req.params.actorId;
    movieActorModel.getMoviesByActor(actorId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching movies for actor", error: err });
        res.json(results);
    });
});

module.exports = router;