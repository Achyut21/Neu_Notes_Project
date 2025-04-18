// src/controllers/auth.controller.js
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// User signup
export const signup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, status } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Generate a unique ID for the user
    const userId = uuidv4();
    
    // Store password as plain text (not secure for production)
    // Note: In a real application, you would hash the password using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user with STUDENT role by default
    await pool.query(
      'INSERT INTO users (id, first_name, last_name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, first_name, last_name, email, password, 'STUDENT', status || 'Undergraduate']
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, 'User registered']
    );
    
    res.status(201).json({
      message: 'User created successfully',
      user: { id: userId, first_name, last_name, email, role: 'STUDENT', status }
    });
  } catch (error) {
    next(error);
  }
};

// User login
export const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      
      // If user doesn't exist, return 401 with specific message
      if (users.length === 0) {
        return res.status(401).json({ message: 'Account not found. Please check your email or register if you\'re a new user.' });
      }
      
      const user = users[0];
      
      // Check password
      const isPasswordValid = password === user.password; // Note: In production, use bcrypt.compare
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password. Please check your credentials.' });
      }
      
      // Create session
      req.session.user = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status
      };
      
      // Log activity
      await pool.query(
        'INSERT INTO activities (user_id, action) VALUES (?, ?)',
        [user.id, 'User logged in']
      );
      
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      });
    } catch (error) {
      next(error);
    }
  };

// User logout
export const logout = (req, res) => {
  // Destroy session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
};

// Get current user - FIXED to handle unauthenticated users gracefully
export const me = (req, res) => {
  if (!req.session || !req.session.user) {
    // Return null instead of an error for unauthenticated users
    return res.status(200).json(null);
  }
  
  res.status(200).json(req.session.user);
};