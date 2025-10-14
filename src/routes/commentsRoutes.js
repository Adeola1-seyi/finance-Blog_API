import express from 'express';
import {
  addCommentToPost,
  getCommentsForPost,
  updateComment,
  getAllComments,
  replyToComment,
  getRepliesForComment,
  getCommentCountForPost,
  deleteComment,
} from '../controllers/commentController.js';
import { authenticateUserToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllComments);
router.get('/post/:postId', getCommentsForPost);
router.get('/post/:postId/count', getCommentCountForPost);
router.get('/:commentId/replies', getRepliesForComment);

router.use(authenticateUserToken);

router.post('/post/:postId', addCommentToPost);
router.post('/:commentId/reply', replyToComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
