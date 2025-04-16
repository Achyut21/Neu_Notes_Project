// src/controllers/subcategory.controller.js - Subcategory controller
import pool from '../db.js';

// Create a new subcategory
export const createSubcategory = async (req, res, next) => {
  try {
    const { name, category_id } = req.body;
    const userId = req.session.user.id;
    
    // Check if category exists
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [category_id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Insert subcategory into database
    const [result] = await pool.query(
      'INSERT INTO subcategories (name, category_id, created_by) VALUES (?, ?, ?)',
      [name, category_id, userId]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Created subcategory: ${name}`]
    );
    
    // Get the created subcategory
    const [subcategories] = await pool.query(
      'SELECT * FROM subcategories WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(subcategories[0]);
  } catch (error) {
    next(error);
  }
};

// Get subcategories by category ID
export const getSubcategoriesByCategoryId = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    const [subcategories] = await pool.query(
      'SELECT s.*, u.first_name, u.last_name FROM subcategories s ' +
      'JOIN users u ON s.created_by = u.id ' +
      'WHERE s.category_id = ? ' +
      'ORDER BY s.created_at DESC',
      [categoryId]
    );
    
    res.status(200).json(subcategories);
  } catch (error) {
    next(error);
  }
};

// Delete subcategory
export const deleteSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if subcategory exists and user has permission
    const [subcategories] = await pool.query(
      'SELECT s.*, c.created_by AS category_created_by FROM subcategories s ' +
      'JOIN categories c ON s.category_id = c.id ' +
      'WHERE s.id = ?',
      [id]
    );
    
    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    const subcategory = subcategories[0];
    
    // Check if user has permission (admin, category creator, or subcategory creator)
    if (
      req.session.user.role !== 'ADMIN' && 
      subcategory.created_by !== userId &&
      subcategory.category_created_by !== userId
    ) {
      return res.status(403).json({ message: 'You do not have permission to delete this subcategory' });
    }
    
    // Delete subcategory (cascade will delete uploads)
    await pool.query('DELETE FROM subcategories WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Deleted subcategory: ${subcategory.name}`]
    );
    
    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    next(error);
  }
};