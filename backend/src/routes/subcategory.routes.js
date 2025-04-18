// src/routes/subcategory.routes.js - Subcategory routes
import express from 'express';
import { createSubcategory, getSubcategoriesByCategoryId, deleteSubcategory, updateSubcategory } from '../controllers/subcategory.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'FACULTY']), createSubcategory);
router.get('/by-category/:categoryId', getSubcategoriesByCategoryId);
router.put('/:id', authMiddleware, updateSubcategory);
router.delete('/:id', authMiddleware, deleteSubcategory);

export default router;
