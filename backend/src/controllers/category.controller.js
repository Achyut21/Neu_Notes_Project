// src/controllers/category.controller.js - Category controller
import pool from '../db.js';

// Generate a random 6-character code (first 3 letters of name + 3 random digits)
const generateCategoryCode = (name) => {
  const prefix = name.substring(0, 3).toUpperCase();
  const randomDigits = Math.floor(Math.random() * 900) + 100; // 3 random digits (100-999)
  return `${prefix}${randomDigits}`;
};

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const userId = req.session.user.id;
    
    // Generate a unique code for the category
    const code = generateCategoryCode(name);
    
    // Insert category into database
    const [result] = await pool.query(
      'INSERT INTO categories (code, name, image, created_by) VALUES (?, ?, ?, ?)',
      [code, name, image || null, userId]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Created category: ${name}`]
    );
    
    // Get the created category
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(categories[0]);
  } catch (error) {
    next(error);
  }
};

// Get all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const [categories] = await pool.query(
      'SELECT c.*, u.first_name, u.last_name FROM categories c ' +
      'JOIN users u ON c.created_by = u.id ' +
      'ORDER BY c.created_at DESC'
    );
    
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// Get category by ID
export const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [categories] = await pool.query(
      'SELECT c.*, u.first_name, u.last_name FROM categories c ' +
      'JOIN users u ON c.created_by = u.id ' +
      'WHERE c.id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(categories[0]);
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const userId = req.session.user.id;
    
    // Check if category exists and user has permission
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const category = categories[0];
    
    // Check if user has permission (admin or creator)
    if (req.session.user.role !== 'ADMIN' && category.created_by !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this category' });
    }
    
    // Update category
    await pool.query(
      'UPDATE categories SET name = ?, image = ? WHERE id = ?',
      [name, image, id]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Updated category: ${name}`]
    );
    
    // Get updated category
    const [updatedCategories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    res.status(200).json(updatedCategories[0]);
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if category exists and user has permission
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const category = categories[0];
    
    // Check if user has permission (admin or creator)
    if (req.session.user.role !== 'ADMIN' && category.created_by !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this category' });
    }
    
    // Delete category (cascade will delete subcategories and uploads)
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Deleted category: ${category.name}`]
    );
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};