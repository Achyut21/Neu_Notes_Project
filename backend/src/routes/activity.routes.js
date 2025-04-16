// src/routes/activity.routes.js
import express from 'express';
import { getAllActivities, getUserActivities, createActivity } from '../controllers/activity.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), getAllActivities);
router.get('/my-activities', authMiddleware, getUserActivities);
router.post('/', authMiddleware, createActivity);

export default router;