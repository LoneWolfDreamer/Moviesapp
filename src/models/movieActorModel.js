// src/models/movieActorModel.js
const db = require('../db');

// Assign actor to a movie (many-to-many relationship)
const assignActorToMovie = (movie_id, actor_id, callback) => {
    const query = "INSERT INTO movie_actor (movie_id, actor_id) VALUES (?, ?)";
    db.query(query, [movie_id, actor_id], callback);
};

// Get actors of a specific movie
const getActorsByMovie = (movieId, callback) => {
    const query = `
        SELECT a.* 
        FROM actors a
        JOIN movie_actor ma ON a.id = ma.actor_id
        WHERE ma.movie_id = ?
    `;
    db.query(query, [movieId], callback);
};

// Get movies of a specific actor
const getMoviesByActor = (actorId, callback) => {
    const query = `
        SELECT m.* 
        FROM movies m
        JOIN movie_actor ma ON m.id = ma.movie_id
        WHERE ma.actor_id = ?
    `;
    db.query(query, [actorId], callback);
};

module.exports = {
    assignActorToMovie,
    getActorsByMovie,
    getMoviesByActor
};