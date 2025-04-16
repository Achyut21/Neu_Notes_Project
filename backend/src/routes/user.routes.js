// src/routes/user.routes.js
import express from 'express';
import { getAllUsers, getUserById, updateUserRole, updateUserProfile, deleteUser } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['ADMIN']), getAllUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id/role', authMiddleware, roleMiddleware(['ADMIN']), updateUserRole);
router.put('/profile', authMiddleware, updateUserProfile);
router.delete('/:id', authMiddleware, roleMiddleware(['ADMIN']), deleteUser);

export default router;