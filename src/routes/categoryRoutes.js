const express = require('express');
const db = require('../db');
const router = express.Router();

// Add a new category
router.post('/add', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }

    db.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name],
        (err) => {
            if (err) return res.status(500).json({ message: "Error adding category", error: err });
            res.json({ message: "Category added successfully" });
        }
    );
});

module.exports = router;