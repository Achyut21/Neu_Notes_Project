// src/routes/upload.routes.js - Upload routes
import express from 'express';
import multer from 'multer';
import { uploadNote, getUploadsBySubcategoryId, getUserUploads, deleteUpload, getUploadById } from '../controllers/upload.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF, PNG, JPG, JPEG files
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, PNG, JPG, JPEG files are allowed'));
    }
  },
});

const router = express.Router();

router.post('/', authMiddleware, upload.single('file'), uploadNote);
router.get('/by-subcategory/:subcategoryId', getUploadsBySubcategoryId);
router.get('/my-uploads', authMiddleware, getUserUploads);
router.delete('/:id', authMiddleware, deleteUpload);
router.get('/:id', getUploadById);

export default router;
