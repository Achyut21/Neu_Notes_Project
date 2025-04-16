// src/controllers/activity.controller.js
import pool from '../db.js';

// Get all activities (admin only)
export const getAllActivities = async (req, res, next) => {
  try {
    const [activities] = await pool.query(
      'SELECT a.*, u.first_name, u.last_name, u.email ' +
      'FROM activities a ' +
      'JOIN users u ON a.user_id = u.id ' +
      'ORDER BY a.timestamp DESC ' +
      'LIMIT 100'
    );
    
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

// Get user's activities
export const getUserActivities = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    
    const [activities] = await pool.query(
      'SELECT * FROM activities ' +
      'WHERE user_id = ? ' +
      'ORDER BY timestamp DESC ' +
      'LIMIT 50',
      [userId]
    );
    
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};

// Create a new activity log
export const createActivity = async (req, res, next) => {
  try {
    const { action } = req.body;
    const userId = req.session.user.id;
    
    if (!action) {
      return res.status(400).json({ message: 'Action is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, action]
    );
    
    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      action,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
};
