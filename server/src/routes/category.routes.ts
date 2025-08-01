import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory
} from '../controllers/category.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(isAuthenticated, isAdmin);

// Category routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Item routes
router.post('/:id/items', addItemToCategory);
router.put('/:id/items/:itemId', updateItemInCategory);
router.delete('/:id/items/:itemId', deleteItemFromCategory);

export default router; 