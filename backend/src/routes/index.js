// src/routes/index.js
import express from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import subcategoryRoutes from './subcategory.routes.js';
import uploadRoutes from './upload.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import activityRoutes from './activity.routes.js';
import userRoutes from './user.routes.js';
import commentRoutes from './comment.routes.js';
import favoritesRoutes from './favorites.routes.js';
import tagsRoutes from './tags.routes.js';
import ratingsRoutes from './ratings.routes.js';

const router = express.Router();

// API status endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'NeuNotes API is running!',
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount all route groups
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/subcategory', subcategoryRoutes);
router.use('/upload', uploadRoutes);
router.use('/enrollment', enrollmentRoutes);
router.use('/activity', activityRoutes);
router.use('/user', userRoutes);
router.use('/comment', commentRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/tags', tagsRoutes);
router.use('/ratings', ratingsRoutes);


// Test endpoint that doesn't require authentication
router.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

export default router;