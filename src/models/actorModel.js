// src/models/actorModel.js
const db = require('../db');

// Create a new actor
const createActor = (name, birth_date, callback) => {
    const query = "INSERT INTO actors (name, birth_date) VALUES (?, ?)";
    db.query(query, [name, birth_date], callback);
};

// Get all actors
const getAllActors = (callback) => {
    const query = "SELECT * FROM actors";
    db.query(query, callback);
};

// Get an actor by ID
const getActorById = (actorId, callback) => {
    const query = "SELECT * FROM actors WHERE id = ?";
    db.query(query, [actorId], callback);
};

// Update an actor's information
const updateActor = (actorId, name, birth_date, callback) => {
    const query = "UPDATE actors SET name = ?, birth_date = ? WHERE id = ?";
    db.query(query, [name, birth_date, actorId], callback);
};

// Delete an actor
const deleteActor = (actorId, callback) => {
    const query = "DELETE FROM actors WHERE id = ?";
    db.query(query, [actorId], callback);
};

// Assign actor to a movie
const assignActorToMovie = (movie_id, actor_id, callback) => {
    const query = "INSERT INTO movie_actor (movie_id, actor_id) VALUES (?, ?)";
    db.query(query, [movie_id, actor_id], callback);
};

module.exports = {
    createActor,
    getAllActors,
    getActorById,
    updateActor,
    deleteActor,
    assignActorToMovie
};

