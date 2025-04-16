// src/controllers/user.controller.js
import pool from '../db.js';

// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, role, status, created_at ' +
      'FROM users ' +
      'ORDER BY created_at DESC'
    );
    
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, role, status, created_at ' +
      'FROM users ' +
      'WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(users[0]);
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const adminId = req.session.user.id;
    
    // Validate role
    if (!['ADMIN', 'FACULTY', 'STUDENT'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user role
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [adminId, `Updated user role for ${users[0].email} to ${role}`]
    );
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id,
        role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const { first_name, last_name, status } = req.body;
    
    // Update user profile
    await pool.query(
      'UPDATE users SET first_name = ?, last_name = ?, status = ? WHERE id = ?',
      [first_name, last_name, status, userId]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, 'Updated profile information']
    );
    
    // Update session data
    req.session.user = {
      ...req.session.user,
      first_name,
      last_name,
      status
    };
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: userId,
        first_name,
        last_name,
        status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminId = req.session.user.id;
    
    // Prevent admin from deleting themselves
    if (id === adminId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Check if user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user (cascade will delete their activities, enrollments, uploads, etc.)
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [adminId, `Deleted user: ${users[0].email}`]
    );
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};