import prisma from '../../prisma/index.js';
import { AppError } from '../utils/error.js';

export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    if (existingLike) {
      return next(new AppError(400, 'You have already liked this post'));
    }

    const like = await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    const likeCount = await prisma.like.count({ where: { postId } });
    await prisma.post.update({
      where: { id: postId },
      data: { likeCount },
    });

    res.status(201).json({ like, likeCount });
  } catch (error) {
    next(new AppError(500, 'Failed to like post', { error }));
  }
};

export const unlikePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const like = await prisma.like.deleteMany({
      where: { postId, userId },
    });
    if (like.count === 0) {
      return next(new AppError(404, 'Like not found'));
    }

    const likeCount = await prisma.like.count({ where: { postId } });
    await prisma.post.update({
      where: { id: postId },
      data: { likeCount },
    });

    res.status(200).json({ message: 'Post unliked successfully', likeCount });
  } catch (error) {
    next(new AppError(500, 'Failed to unlike post', { error }));
  }
};

export const getLikesForPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: true },
    });
    res.status(200).json({ likes });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve likes', { error }));
  }
};

export const getAllLikes = async (req, res, next) => {
  try {
    const likes = await prisma.like.findMany({
      include: { user: true, post: true },
    });
    res.status(200).json({ likes });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve likes', { error }));
  }
};

export const getLikesCountForPost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const count = await prisma.like.count({
      where: { postId },
    });
    res.status(200).json({ count });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve likes count', { error }));
  }
};
