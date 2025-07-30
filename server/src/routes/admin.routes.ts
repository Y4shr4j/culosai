import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  addTokensToUser,
  getAdminStats,
  getTransactionHistory
} from '../controllers/admin.controller';
import { isAuthenticated, isAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require admin authentication
router.use(isAuthenticated, isAdmin);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Token management
router.post('/users/:id/tokens', addTokensToUser);

// Analytics and stats
router.get('/stats', getAdminStats);
router.get('/transactions', getTransactionHistory);

export default router; 