// src/controllers/upload.controller.js - Upload controller
import pool from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fsPromises } from 'fs';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
fs.existsSync(uploadsDir) || fs.mkdirSync(uploadsDir, { recursive: true });

// Upload a new note
export const uploadNote = async (req, res, next) => {
  try {
    const { subcategory_id, description } = req.body;
    const file = req.file;
    const userId = req.session.user.id;
    
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    
    // Check if subcategory exists
    const [subcategories] = await pool.query(
      'SELECT * FROM subcategories WHERE id = ?',
      [subcategory_id]
    );
    
    if (subcategories.length === 0) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    
    // Store file in filesystem
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);
    
    await fsPromises.writeFile(filePath, file.buffer);
    
    // Store file metadata in database
    const [uploadResult] = await pool.query(
      'INSERT INTO uploads (uploaded_by, subcategory_id) VALUES (?, ?)',
      [userId, subcategory_id]
    );
    
    const uploadId = uploadResult.insertId;
    
    // Store file metadata
    await pool.query(
      'INSERT INTO file_metadata (upload_id, file_name, file_type, file_size, file_url, description) VALUES (?, ?, ?, ?, ?, ?)',
      [
        uploadId,
        file.originalname,
        file.mimetype,
        file.size,
        `/uploads/${fileName}`,
        description || null
      ]
    );
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Uploaded note: ${file.originalname}`]
    );
    
    // Get uploaded file with metadata
    const [uploads] = await pool.query(
      'SELECT u.*, m.file_name, m.file_type, m.file_size, m.file_url, m.description ' +
      'FROM uploads u ' +
      'JOIN file_metadata m ON u.id = m.upload_id ' +
      'WHERE u.id = ?',
      [uploadId]
    );
    
    res.status(201).json(uploads[0]);
  } catch (error) {
    next(error);
  }
};

// Get uploads by subcategory ID
export const getUploadsBySubcategoryId = async (req, res, next) => {
  try {
    const { subcategoryId } = req.params;
    
    const [uploads] = await pool.query(
      'SELECT u.*, m.file_name, m.file_type, m.file_size, m.file_url, m.description, ' +
      'usr.first_name, usr.last_name ' +
      'FROM uploads u ' +
      'JOIN file_metadata m ON u.id = m.upload_id ' +
      'JOIN users usr ON u.uploaded_by = usr.id ' +
      'WHERE u.subcategory_id = ? ' +
      'ORDER BY u.uploaded_at DESC',
      [subcategoryId]
    );
    
    res.status(200).json(uploads);
  } catch (error) {
    next(error);
  }
};

// Get user's uploads
export const getUserUploads = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    
    const [uploads] = await pool.query(
      'SELECT u.*, m.file_name, m.file_type, m.file_size, m.file_url, m.description, ' +
      's.name AS subcategory_name, s.id AS subcategory_id, ' +
      'c.name AS category_name, c.id AS category_id ' +
      'FROM uploads u ' +
      'JOIN file_metadata m ON u.id = m.upload_id ' +
      'JOIN subcategories s ON u.subcategory_id = s.id ' +
      'JOIN categories c ON s.category_id = c.id ' +
      'WHERE u.uploaded_by = ? ' +
      'ORDER BY u.uploaded_at DESC',
      [userId]
    );
    
    res.status(200).json(uploads);
  } catch (error) {
    next(error);
  }
};

// Delete upload
export const deleteUpload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    
    // Check if upload exists and user has permission
    const [uploads] = await pool.query(
      'SELECT u.*, m.file_url, m.file_name FROM uploads u ' +
      'JOIN file_metadata m ON u.id = m.upload_id ' +
      'WHERE u.id = ?',
      [id]
    );
    
    if (uploads.length === 0) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    const upload = uploads[0];
    
    // Check if user has permission (admin or uploader)
    if (req.session.user.role !== 'ADMIN' && upload.uploaded_by !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this upload' });
    }
    
    // Delete file from filesystem
    const filePath = path.join(__dirname, '../..', upload.file_url);
    if (fs.existsSync(filePath)) {
      await fsPromises.unlink(filePath);
    }
    
    // Delete upload from database (cascade will delete file metadata)
    await pool.query('DELETE FROM uploads WHERE id = ?', [id]);
    
    // Log activity
    await pool.query(
      'INSERT INTO activities (user_id, action) VALUES (?, ?)',
      [userId, `Deleted upload: ${upload.file_name}`]
    );
    
    res.status(200).json({ message: 'Upload deleted successfully' });
  } catch (error) {
    next(error);
  }
};