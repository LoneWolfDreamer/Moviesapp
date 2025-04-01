// src/models/categoryModel.js
const db = require('../db');

// Create a new category
const createCategory = (name, callback) => {
    const query = "INSERT INTO categories (name) VALUES (?)";
    db.query(query, [name], callback);
};

// Get all categories
const getAllCategories = (callback) => {
    const query = "SELECT * FROM categories";
    db.query(query, callback);
};

// Get a category by ID
const getCategoryById = (categoryId, callback) => {
    const query = "SELECT * FROM categories WHERE id = ?";
    db.query(query, [categoryId], callback);
};

// Update a category
const updateCategory = (categoryId, name, callback) => {
    const query = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(query, [name, categoryId], callback);
};

// Delete a category
const deleteCategory = (categoryId, callback) => {
    const query = "DELETE FROM categories WHERE id = ?";
    db.query(query, [categoryId], callback);
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};