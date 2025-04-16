// src/routes/comment.routes.js
import express from 'express';
import { createComment, getCommentsByUploadId, updateComment, deleteComment } from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createComment);
router.get('/by-upload/:uploadId', getCommentsByUploadId);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;