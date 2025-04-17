// src/controllers/ratings.controller.js
import pool from '../db.js';

// Rate a note
export const rateNote = async (req, res, next) => {
  try {
    const { upload_id, rating } = req.body;
    const userId = req.session.user.id;
    
    // Use stored procedure to add or update rating
    await pool.query(
      'CALL add_or_update_rating(?, ?, ?, @rating_id, @is_new)',
      [userId, upload_id, rating]
    );
    
    // Get output parameters
    const [output] = await pool.query('SELECT @rating_id AS rating_id, @is_new AS is_new');
    
    // Get rating details
    const [ratings] = await pool.query(
      'SELECT * FROM ratings WHERE id = ?',
      [output[0].rating_id]
    );
    
    if (ratings.length === 0) {
      return res.status(500).json({ message: 'Failed to retrieve rating' });
    }
    
    res.status(output[0].is_new ? 201 : 200).json(ratings[0]);
  } catch (error) {
    // Handle specific errors from the stored procedure
    if (error.sqlState === '45000') {
      return res.status(400).json({ message: error.message });
    }
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
    
    // Delete rating - trigger will handle updating average rating
    await pool.query('DELETE FROM ratings WHERE id = ?', [id]);
    
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
    
    // Get from the uploads table directly since triggers maintain this data
    const [uploads] = await pool.query(
      'SELECT average_rating, rating_count FROM uploads WHERE id = ?',
      [uploadId]
    );
    
    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    res.status(200).json({
      average_rating: uploads[0].average_rating || 0,
      rating_count: uploads[0].rating_count || 0
    });
  } catch (error) {
    next(error);
  }
};