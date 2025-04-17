// src/controllers/favorites.controller.js
import pool from '../db.js';

// Add a favorite
export const addFavorite = async (req, res, next) => {
  try {
    const { upload_id } = req.body;
    const userId = req.session.user.id;
    
    // Check if upload exists
    const [uploads] = await pool.query('SELECT * FROM uploads WHERE id = ?', [upload_id]);
    
    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    // Check if already favorited
    const [existingFavorites] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND upload_id = ?',
      [userId, upload_id]
    );
    
    if (existingFavorites.length > 0) {
      return res.status(400).json({ message: 'Already favorited this note' });
    }
    
    // Add to favorites
    const [result] = await pool.query(
      'INSERT INTO favorites (user_id, upload_id) VALUES (?, ?)',
      [userId, upload_id]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Added note to favorites`]
    );
    
    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      upload_id,
      created_at: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Remove a favorite
export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if favorite exists and belongs to user
    const [favorites] = await pool.query(
      'SELECT * FROM favorites WHERE id = ?',
      [id]
    );
    
    if (favorites.length === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    const favorite = favorites[0];
    
    // Check if user owns the favorite or is admin
    if (req.session.user.role !== 'ADMIN' && favorite.user_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to remove this favorite' });
    }
    
    // Remove favorite
    await pool.query('DELETE FROM favorites WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Removed note from favorites`]
    );
    
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    
    const [favorites] = await pool.query(
      'SELECT f.*, fm.file_name, fm.file_url, fm.description, ' +
      's.name AS subcategory_name, c.name AS category_name, ' +
      'c.id AS category_id, u.id AS upload_id ' +
      'FROM favorites f ' +
      'JOIN uploads u ON f.upload_id = u.id ' +
      'JOIN file_metadata fm ON u.id = fm.upload_id ' +
      'JOIN subcategories s ON u.subcategory_id = s.id ' +
      'JOIN categories c ON s.category_id = c.id ' +
      'WHERE f.user_id = ? ' +
      'ORDER BY f.created_at DESC',
      [userId]
    );
    
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

// Check if a note is favorited by the user
export const checkFavorite = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const userId = req.session.user.id;
    
    const [favorites] = await pool.query(
      'SELECT * FROM favorites WHERE user_id = ? AND upload_id = ?',
      [userId, uploadId]
    );
    
    res.status(200).json({
      favorited: favorites.length > 0,
      favorite: favorites.length > 0 ? favorites[0] : null
    });
  } catch (error) {
    next(error);
  }
};

export const getMyFavoriteIds = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    
    const [favorites] = await pool.query(
      'SELECT id, upload_id FROM favorites WHERE user_id = ?',
      [userId]
    );
    
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};