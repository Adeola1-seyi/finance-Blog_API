import express from 'express';
import {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  resetPassword,
  logoutUser,
  getCurrentUser,
  promoteToAdmin,
  demoteFromAdmin,
} from '../controllers/userController.js';
import { authenticateUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(authenticateUserToken);

router.get('/me', getCurrentUser);
router.post('/logout', logoutUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.patch('/:id/password', updatePassword);
router.delete('/:id', deleteUser);
router.patch('/:id/promote', promoteToAdmin);
router.patch('/:id/demote', demoteFromAdmin);

export default router;
