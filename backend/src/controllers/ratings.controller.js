// src/controllers/ratings.controller.js
import pool from '../db.js';

// Rate a note
export const rateNote = async (req, res, next) => {
  try {
    const { upload_id, rating } = req.body;
    const userId = req.session.user.id;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if upload exists
    const [uploads] = await pool.query('SELECT * FROM uploads WHERE id = ?', [upload_id]);
    
    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    // Check if user has already rated this note
    const [existingRatings] = await pool.query(
      'SELECT * FROM ratings WHERE user_id = ? AND upload_id = ?',
      [userId, upload_id]
    );
    
    if (existingRatings.length > 0) {
      // Update existing rating
      await pool.query(
        'UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [rating, existingRatings[0].id]
      );
      
      // Log activity
      await pool.query(
        'INSERT INTO activities (user_id, action) VALUES (?, ?)',
        [userId, `Updated rating for a note to ${rating} stars`]
      );
      
      const [updatedRating] = await pool.query(
        'SELECT * FROM ratings WHERE id = ?',
        [existingRatings[0].id]
      );
      
      return res.status(200).json(updatedRating[0]);
    }
    
    // Create new rating
    const [result] = await pool.query(
      'INSERT INTO ratings (user_id, upload_id, rating) VALUES (?, ?, ?)',
      [userId, upload_id, rating]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Rated a note ${rating} stars`]
    );
    
    const [newRating] = await pool.query(
      'SELECT * FROM ratings WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newRating[0]);
  } catch (error) {
    next(error);
  }
};

// Delete a rating
export const deleteRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if rating exists and belongs to user
    const [ratings] = await pool.query(
      'SELECT * FROM ratings WHERE id = ?',
      [id]
    );
    
    if (ratings.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    const rating = ratings[0];
    
    // Check if user owns the rating or is admin
    if (req.session.user.role !== 'ADMIN' && rating.user_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this rating' });
    }
    
    // Delete rating
    await pool.query('DELETE FROM ratings WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Deleted rating for a note`]
    );
    
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get user's rating for a note
export const getUserRating = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    const userId = req.session.user.id;
    
    const [ratings] = await pool.query(
      'SELECT * FROM ratings WHERE user_id = ? AND upload_id = ?',
      [userId, uploadId]
    );
    
    res.status(200).json({
      rated: ratings.length > 0,
      rating: ratings.length > 0 ? ratings[0] : null
    });
  } catch (error) {
    next(error);
  }
};

// Get average rating for a note
export const getAverageRating = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    
    const [result] = await pool.query(
      'SELECT AVG(rating) AS average_rating, COUNT(*) AS rating_count ' +
      'FROM ratings ' +
      'WHERE upload_id = ?',
      [uploadId]
    );
    
    res.status(200).json({
      average_rating: result[0].average_rating || 0,
      rating_count: result[0].rating_count
    });
  } catch (error) {
    next(error);
  }
};