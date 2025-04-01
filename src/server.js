require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ✅ MySQL Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "movies_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// ✅ JWT Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
};

// ✅ User Registration
app.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const [results] = await db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);
        if (results.length > 0) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, role || "user"]);
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

// ✅ User Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [results] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

// ✅ User Update
app.post("/update-user", authenticate, async (req, res) => {
    const { newUsername, newPassword } = req.body;
    try {
        const updates = [];
        const values = [];

        if (newUsername) {
            updates.push("username = ?");
            values.push(newUsername);
        }
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.push("password = ?");
            values.push(hashedPassword);
        }
        if (updates.length === 0) return res.status(400).json({ message: "No changes provided" });

        await db.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, [...values, req.user.id]);
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating user" });
    }
});

// ✅ Get User Info
app.get("/user-info", authenticate, async (req, res) => {
    try {
        const [results] = await db.query("SELECT username, role FROM users WHERE id = ?", [req.user.id]);
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ message: "Database error" });
    }
});

// ✅ Get All Movies
app.get("/", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM movies");
        res.render("index", { movies: results });
    } catch (err) {
        res.status(500).json({ message: "Error loading movies" });
    }
});

// ✅ Get Movie Details
app.get("/movie/:id", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM movies WHERE id = ?", [req.params.id]);
        if (results.length === 0) return res.status(404).json({ message: "Movie not found" });
        res.render("movie", { movie: results[0] });
    } catch (err) {
        res.status(500).json({ message: "Error loading movie" });
    }
});

// ✅ Serve Static Pages
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/movie.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "movie.html"));
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});