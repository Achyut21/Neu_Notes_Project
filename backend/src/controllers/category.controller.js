// src/controllers/category.controller.js
import pool from '../db.js';

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const userId = req.session.user.id;
    
    // Use stored procedure to create category
    const [result] = await pool.query(
      'CALL create_category(?, ?, ?, @id, @code)',
      [name, image || null, userId]
    );
    
    // Get the output parameters
    const [output] = await pool.query('SELECT @id AS id, @code AS code');
    
    // Get the created category with all details
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [output[0].id]
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