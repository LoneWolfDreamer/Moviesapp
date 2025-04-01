// src/routes/actorRoutes.js
const express = require('express');
const actorModel = require('../models/actorModel');
const router = express.Router();

// Add a new actor
router.post('/add', (req, res) => {
    const { name, birth_date } = req.body;

    if (!name || !birth_date) {
        return res.status(400).json({ message: "Name and birth date are required" });
    }

    actorModel.createActor(name, birth_date, (err) => {
        if (err) return res.status(500).json({ message: "Error adding actor", error: err });
        res.json({ message: "Actor added successfully" });
    });
});

// Get all actors
router.get('/', (req, res) => {
    actorModel.getAllActors((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching actors", error: err });
        res.json(results);
    });
});

// Get actor by ID
router.get('/:actorId', (req, res) => {
    const actorId = req.params.actorId;
    actorModel.getActorById(actorId, (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching actor", error: err });
        res.json(result);
    });
});

// Assign actor to a movie
router.post('/assign-to-movie', (req, res) => {
    const { movie_id, actor_id } = req.body;

    if (!movie_id || !actor_id) {
        return res.status(400).json({ message: "Movie ID and Actor ID are required" });
    }

    actorModel.assignActorToMovie(movie_id, actor_id, (err) => {
        if (err) return res.status(500).json({ message: "Error assigning actor to movie", error: err });
        res.json({ message: "Actor assigned to movie successfully" });
    });
});

module.exports = router;