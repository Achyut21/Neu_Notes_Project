// src/controllers/comment.controller.js
import pool from '../db.js';

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { upload_id, content } = req.body;
    const userId = req.session.user.id;
    
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Check if upload exists
    const [uploads] = await pool.query('SELECT * FROM uploads WHERE id = ?', [upload_id]);
    
    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    // Create comment
    const [result] = await pool.query(
      'INSERT INTO comments (upload_id, user_id, content) VALUES (?, ?, ?)',
      [upload_id, userId, content]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Commented on an upload`]
    );
    
    // Get the created comment with user info
    const [comments] = await pool.query(
      'SELECT c.*, u.first_name, u.last_name FROM comments c ' +
      'JOIN users u ON c.user_id = u.id ' +
      'WHERE c.id = ?',
      [result.insertId]
    );
    
    res.status(201).json(comments[0]);
  } catch (error) {
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
    
    if (!content) {
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
      [content, id]
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
    
    // Delete comment
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Deleted a comment`]
    );
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
