import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';
import { authenticateUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlog);

router.use(authenticateUserToken);

router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;
