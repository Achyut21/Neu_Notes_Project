// src/controllers/enrollment.controller.js - Enrollment controller
import pool from '../db.js';

// Create a new enrollment
export const createEnrollment = async (req, res, next) => {
  try {
    const { category_id } = req.body;
    const userId = req.session.user.id;
    
    // Check if category exists
    const [categories] = await pool.query(
      'SELECT * FROM categories WHERE id = ?',
      [category_id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if already enrolled
    const [existingEnrollments] = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = ? AND category_id = ?',
      [userId, category_id]
    );
    
    if (existingEnrollments.length > 0) {
      return res.status(400).json({ message: 'Already enrolled in this category' });
    }
    
    // Create enrollment
    const [result] = await pool.query(
      'INSERT INTO enrollments (student_id, category_id) VALUES (?, ?)',
      [userId, category_id]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Enrolled in category: ${categories[0].name}`]
    );
    
    res.status(201).json({
      id: result.insertId,
      student_id: userId,
      category_id,
      enrolled_at: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Check if user is enrolled in a category
export const checkEnrollment = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const userId = req.session.user.id;
    
    const [enrollments] = await pool.query(
      'SELECT * FROM enrollments WHERE student_id = ? AND category_id = ?',
      [userId, categoryId]
    );
    
    res.status(200).json({
      enrolled: enrollments.length > 0
    });
  } catch (error) {
    next(error);
  }
};

// Get user's enrollments
export const getUserEnrollments = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    
    const [enrollments] = await pool.query(
      'SELECT e.*, c.name AS category_name, c.code AS category_code ' +
      'FROM enrollments e ' +
      'JOIN categories c ON e.category_id = c.id ' +
      'WHERE e.student_id = ? ' +
      'ORDER BY e.enrolled_at DESC',
      [userId]
    );
    
    res.status(200).json(enrollments);
  } catch (error) {
    next(error);
  }
};

// Delete enrollment
export const deleteEnrollment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if enrollment exists and belongs to user
    const [enrollments] = await pool.query(
      'SELECT e.*, c.name AS category_name FROM enrollments e ' +
      'JOIN categories c ON e.category_id = c.id ' +
      'WHERE e.id = ?',
      [id]
    );
    
    if (enrollments.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    const enrollment = enrollments[0];
    
    // Check if user has permission (admin or owner)
    if (req.session.user.role !== 'ADMIN' && enrollment.student_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this enrollment' });
    }
    
    // Delete enrollment
    await pool.query('DELETE FROM enrollments WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Unenrolled from category: ${enrollment.category_name}`]
    );
    
    res.status(200).json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
