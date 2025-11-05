import prisma from '../../prisma/index.js';
import { AppError } from '../utils/error.js';

const Comment = prisma.comment;

export const addCommentToPost = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const comment = await Comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json({ comment });
  } catch (error) {
    next(new AppError(500, 'Failed to add comment', { error }));
  }
};

export const getCommentsForPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.findMany({
      where: { postId },
      include: { user: true },
    });
    res.status(200).json({ comments });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve comments', { error }));
  }
};

export const updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.update({
      where: { id },
      data: { content },
    });
    res.status(200).json({ comment });
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new AppError(404, 'Comment not found'));
    }
    next(new AppError(500, 'Failed to update comment', { error }));
  }
};

export const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.findMany({
      include: { user: true },
    });
    res.status(200).json({ comments });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve comments', { error }));
  }
};

export const getCommentCountForPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const count = await Comment.count({
      where: { postId },
    });
    res.status(200).json({ count });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve comment count', { error }));
  }
};

export const deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Comment.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return next(new AppError(404, 'Comment not found'));
    }
    next(new AppError(500, 'Failed to delete comment', { error }));
  }
};
