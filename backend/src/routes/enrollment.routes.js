// src/routes/enrollment.routes.js - Enrollment routes
import express from 'express';
import { createEnrollment, checkEnrollment, getUserEnrollments, deleteEnrollment } from '../controllers/enrollment.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['STUDENT']), createEnrollment);
router.get('/check/:categoryId', authMiddleware, checkEnrollment);
router.get('/my-enrollments', authMiddleware, roleMiddleware(['STUDENT']), getUserEnrollments);
router.delete('/:id', authMiddleware, deleteEnrollment);

export default router;
