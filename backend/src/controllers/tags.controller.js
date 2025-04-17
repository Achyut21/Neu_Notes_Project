// src/controllers/tags.controller.js
import pool from '../db.js';

// Create a new tag
export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.session.user.id;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Tag name is required' });
    }
    
    // Check if tag already exists
    const [existingTags] = await pool.query(
      'SELECT * FROM tags WHERE name = ?',
      [name.trim()]
    );
    
    if (existingTags.length > 0) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    
    // Create tag
    const [result] = await pool.query(
      'INSERT INTO tags (name, created_by) VALUES (?, ?)',
      [name.trim(), userId]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Created tag: ${name}`]
    );
    
    const [tags] = await pool.query(
      'SELECT * FROM tags WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(tags[0]);
  } catch (error) {
    next(error);
  }
};

// Get all tags
export const getAllTags = async (req, res, next) => {
  try {
    const [tags] = await pool.query(
      'SELECT * FROM tags ORDER BY name ASC'
    );
    
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

// Add tag to a note
export const addTagToNote = async (req, res, next) => {
  try {
    const { upload_id, tag_id } = req.body;
    const userId = req.session.user.id;
    
    // Check if upload exists
    const [uploads] = await pool.query('SELECT * FROM uploads WHERE id = ?', [upload_id]);
    
    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    // Check if tag exists
    const [tags] = await pool.query('SELECT * FROM tags WHERE id = ?', [tag_id]);
    
    if (tags.length === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    // Check if tag is already applied to the note
    const [existingNoteTags] = await pool.query(
      'SELECT * FROM note_tags WHERE upload_id = ? AND tag_id = ?',
      [upload_id, tag_id]
    );
    
    if (existingNoteTags.length > 0) {
      return res.status(400).json({ message: 'Tag already applied to this note' });
    }
    
    // Add tag to note
    const [result] = await pool.query(
      'INSERT INTO note_tags (upload_id, tag_id) VALUES (?, ?)',
      [upload_id, tag_id]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Added tag "${tags[0].name}" to a note`]
    );
    
    res.status(201).json({
      id: result.insertId,
      upload_id,
      tag_id,
      created_at: new Date()
    });
  } catch (error) {
    next(error);
  }
};

// Remove tag from a note
export const removeTagFromNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if note_tag exists
    const [noteTags] = await pool.query(
      'SELECT nt.*, t.name AS tag_name, u.uploaded_by ' +
      'FROM note_tags nt ' +
      'JOIN tags t ON nt.tag_id = t.id ' +
      'JOIN uploads u ON nt.upload_id = u.id ' +
      'WHERE nt.id = ?',
      [id]
    );
    
    if (noteTags.length === 0) {
      return res.status(404).json({ message: 'Tag association not found' });
    }
    
    const noteTag = noteTags[0];
    
    // Check if user has permission (admin, upload owner, or tag creator)
    if (
      req.session.user.role !== 'ADMIN' && 
      noteTag.uploaded_by !== userId
    ) {
      return res.status(403).json({ message: 'You do not have permission to remove this tag' });
    }
    
    // Remove tag from note
    await pool.query('DELETE FROM note_tags WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Removed tag "${noteTag.tag_name}" from a note`]
    );
    
    res.status(200).json({ message: 'Tag removed from note successfully' });
  } catch (error) {
    next(error);
  }
};

// Get tags for a note
export const getTagsForNote = async (req, res, next) => {
  try {
    const { uploadId } = req.params;
    
    const [tags] = await pool.query(
      'SELECT t.*, nt.id AS note_tag_id ' +
      'FROM tags t ' +
      'JOIN note_tags nt ON t.id = nt.tag_id ' +
      'WHERE nt.upload_id = ? ' +
      'ORDER BY t.name ASC',
      [uploadId]
    );
    
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};