// src/routes/favorites.routes.js
// src/routes/favorites.routes.js
import express from 'express';
import { 
  addFavorite, 
  removeFavorite, 
  getUserFavorites, 
  checkFavorite,
  getMyFavoriteIds 
} from '../controllers/favorites.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addFavorite);
router.delete('/:id', authMiddleware, removeFavorite);
router.get('/my-favorites', authMiddleware, getUserFavorites);
router.get('/check/:uploadId', authMiddleware, checkFavorite);
router.get('/my-favorite-ids', authMiddleware, getMyFavoriteIds);

export default router;