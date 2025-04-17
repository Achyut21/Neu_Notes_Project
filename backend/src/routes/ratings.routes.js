// src/routes/ratings.routes.js
import express from 'express';
import { rateNote, deleteRating, getUserRating, getAverageRating } from '../controllers/ratings.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, rateNote);
router.delete('/:id', authMiddleware, deleteRating);
router.get('/user/:uploadId', authMiddleware, getUserRating);
router.get('/average/:uploadId', getAverageRating);

export default router;