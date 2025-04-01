// src/routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../db');  // Assuming db.js handles MySQL connection
const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (results.length > 0) return res.status(400).json({ message: "User already exists" });

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query(
                "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
                [username, email, hashedPassword, role || "user"],
                (err) => {
                    if (err) return res.status(500).json({ message: "Error registering user", error: err });
                    res.json({ message: "User registered successfully" });
                }
            );
        } catch (hashError) {
            res.status(500).json({ message: "Error hashing password", error: hashError });
        }
    });
});

// ✅ User Login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (results.length === 0) return res.status(401).json({ message: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, username: user.username, role: user.role, message: "Login successful" });
    });
});

// ✅ Get User Info
router.get("/user-info", authenticate, (req, res) => {
    db.query("SELECT username, email, role FROM users WHERE id = ?", [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json(results[0]);
    });
});

// ✅ Authentication Middleware (for protected routes)
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
};

module.exports = router;