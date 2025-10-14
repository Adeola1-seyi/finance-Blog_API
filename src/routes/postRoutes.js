import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { authenticateUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPost);

router.use(authenticateUserToken);

router.post('/blog/:blogId', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
