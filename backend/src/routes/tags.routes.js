// src/routes/tags.routes.js
import express from 'express';
import { createTag, getAllTags, addTagToNote, removeTagFromNote, getTagsForNote } from '../controllers/tags.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTag);
router.get('/', getAllTags);
router.post('/note-tag', authMiddleware, addTagToNote);
router.delete('/note-tag/:id', authMiddleware, removeTagFromNote);
router.get('/by-upload/:uploadId', getTagsForNote);

export default router;