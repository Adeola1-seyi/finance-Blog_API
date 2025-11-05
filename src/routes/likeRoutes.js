import express from 'express';
import {
  likePost,
  unlikePost,
  getLikesForPost,
  getAllLikes,
  getLikesCountForPost,
} from '../controllers/likeController.js';
import { authenticateUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllLikes);
router.get('/:postId', getLikesForPost);
router.get('/:postId/count', getLikesCountForPost);

// Protected routes
router.use(authenticateUserToken);

router.post('/:postId', likePost);
router.delete('/:postId', unlikePost);

export default router;
