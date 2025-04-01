// src/models/movieModel.js
const db = require('../db');

// Create a new movie
const createMovie = (title, release_date, category_id, callback) => {
    const query = "INSERT INTO movies (title, release_date, category_id) VALUES (?, ?, ?)";
    db.query(query, [title, release_date, category_id], callback);
};

// Get all movies
const getAllMovies = (callback) => {
    const query = "SELECT * FROM movies";
    db.query(query, callback);
};

// Get a movie by ID
const getMovieById = (movieId, callback) => {
    const query = "SELECT * FROM movies WHERE id = ?";
    db.query(query, [movieId], callback);
};

// Get movies by category ID
const getMoviesByCategory = (categoryId, callback) => {
    const query = "SELECT * FROM movies WHERE category_id = ?";
    db.query(query, [categoryId], callback);
};

// Update a movie
const updateMovie = (movieId, title, release_date, category_id, callback) => {
    const query = "UPDATE movies SET title = ?, release_date = ?, category_id = ? WHERE id = ?";
    db.query(query, [title, release_date, category_id, movieId], callback);
};

// Delete a movie
const deleteMovie = (movieId, callback) => {
    const query = "DELETE FROM movies WHERE id = ?";
    db.query(query, [movieId], callback);
};

module.exports = {
    createMovie,
    getAllMovies,
    getMovieById,
    getMoviesByCategory,
    updateMovie,
    deleteMovie
};