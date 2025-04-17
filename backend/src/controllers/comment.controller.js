// src/controllers/comment.controller.js
import pool from '../db.js';

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { upload_id, content } = req.body;
    const userId = req.session.user.id;
    
    // Use stored procedure to add comment
    await pool.query(
      'CALL add_comment(?, ?, ?, @comment_id)',
      [userId, upload_id, content]
    );
    
    // Get output parameter
    const [output] = await pool.query('SELECT @comment_id AS comment_id');
    
    // Get the created comment with user info
    const [comments] = await pool.query(
      'SELECT c.*, u.first_name, u.last_name FROM comments c ' +
      'JOIN users u ON c.user_id = u.id ' +
      'WHERE c.id = ?',
      [output[0].comment_id]
    );
    
    res.status(201).json(comments[0]);
  } catch (error) {
    // Handle specific errors from stored procedure
    if (error.sqlState === '45000') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// Get comments for an upload
export const getCommentsByUploadId = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    
    const [comments] = await pool.query(
      'SELECT c.*, u.first_name, u.last_name FROM comments c ' +
      'JOIN users u ON c.user_id = u.id ' +
      'WHERE c.upload_id = ? ' +
      'ORDER BY c.created_at DESC',
      [uploadId]
    );
    
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// Update a comment
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.session.user.id;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Check if comment exists and belongs to user
    const [comments] = await pool.query(
      'SELECT * FROM comments WHERE id = ?',
      [id]
    );
    
    if (comments.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const comment = comments[0];
    
    // Check if user has permission (admin or comment owner)
    if (req.session.user.role !== 'ADMIN' && comment.user_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this comment' });
    }
    
    // Update comment
    await pool.query(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content.trim(), id]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Updated a comment`]
    );
    
    // Get updated comment
    const [updatedComments] = await pool.query(
      'SELECT c.*, u.first_name, u.last_name FROM comments c ' +
      'JOIN users u ON c.user_id = u.id ' +
      'WHERE c.id = ?',
      [id]
    );
    
    res.status(200).json(updatedComments[0]);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if comment exists
    const [comments] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    
    if (comments.length === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    const comment = comments[0];
    
    // Check if user has permission (admin or comment owner)
    if (req.session.user.role !== 'ADMIN' && comment.user_id !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this comment' });
    }
    
    // Delete comment - trigger will handle updating comment count
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};