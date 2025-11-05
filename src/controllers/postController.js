import prisma from '../../prisma/index.js';
import { AppError } from '../utils/error.js';

const Post = prisma.post;

export const createPost = async (req, res, next) => {
  const { blogId } = req.params;
  const { title, content, coverImageUrl } = req.body;
  const userId = req.user?.id;

  if (!title || !content) {
    return next(new AppError(400, 'Title and content are required'));
  }

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return next(new AppError(404, 'Blog not found'));

    const post = await Post.create({
      data: {
        title,
        content,
        coverImageUrl,
        blog: { connect: { id: blogId } },
        user: { connect: { id: userId } },
      },
      include: { user: true, blog: true },
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    next(new AppError(500, 'Failed to create post', { error }));
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findMany({
      include: { user: true, blog: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ posts });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve posts', { error }));
  }
};

export const getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findUnique({
      where: { id },
      include: { user: true, blog: true, likes: true },
    });

    if (!post) return next(new AppError(404, 'Post not found'));
    res.status(200).json({ post });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve post', { error }));
  }
};

export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, coverImageUrl } = req.body;

  try {
    const existingPost = await Post.findUnique({ where: { id } });
    if (!existingPost) return next(new AppError(404, 'Post not found'));

    const post = await Post.update({
      where: { id },
      data: { title, content, coverImageUrl },
    });

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    next(new AppError(500, 'Failed to update post', { error }));
  }
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const existingPost = await Post.findUnique({ where: { id } });
    if (!existingPost) return next(new AppError(404, 'Post not found'));

    await Post.delete({ where: { id } });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(new AppError(500, 'Failed to delete post', { error }));
  }
};

export const likePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId, userId },
    });
    if (existingLike) {
      return next(new AppError(400, 'You have already liked this post'));
    }

    await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    const likeCount = await prisma.like.count({ where: { postId } });
    await Post.update({ where: { id: postId }, data: { likeCount } });

    res.status(201).json({ message: 'Post liked successfully', likeCount });
  } catch (error) {
    next(new AppError(500, 'Failed to like post', { error }));
  }
};

export const unlikePost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const like = await prisma.like.deleteMany({
      where: { postId, userId },
    });

    if (like.count === 0) {
      return next(new AppError(404, 'Like not found'));
    }

    const likeCount = await prisma.like.count({ where: { postId } });
    await Post.update({ where: { id: postId }, data: { likeCount } });

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
    res.status(200).json({ count: likes.length, likes });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve likes', { error }));
  }
};

export const getLikesCountForPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const count = await prisma.like.count({ where: { postId } });
    res.status(200).json({ count });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve like count', { error }));
  }
};

export const getAllLikes = async (req, res, next) => {
  try {
    const likes = await prisma.like.findMany({
      include: { user: true, post: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ likes });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve all likes', { error }));
  }
};
