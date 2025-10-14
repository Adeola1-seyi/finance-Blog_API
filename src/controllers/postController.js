import prisma from '../prisma/index.js';
import { AppError } from '../utils/error.js';       

const Post = prisma.post;

export const createPost = async (req, res, next) => {
  const { blogId } = req.params;
  const { title, content, coverImageUrl } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.create({
      data: {
        title,
        content,
        coverImageUrl,
        blog: { connect: { id: blogId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json({ post });
  } catch (error) {
    next(new AppError(500, 'Failed to create post', { error }));
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.findMany({
      include: { user: true, blog: true },
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
      include: { user: true, blog: true },
    });
    if (!post) {
      return next(new AppError(404, 'Post not found'));
    }
    res.status(200).json({ post });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve post', { error }));
  }
};  

export const updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, content, coverImageUrl } = req.body;

  try {
    const post = await Post.update({
      where: { id },
      data: { title, content, coverImageUrl },
    });
    if (!post) {
      return next(new AppError(404, 'Post not found'));
    }
    res.status(200).json({ post });
  } catch (error) {
    next(new AppError(500, 'Failed to update post', { error }));
  }
};
export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.delete({
      where: { id },
    });
    if (!post) {
      return next(new AppError(404, 'Post not found'));
    }
    res.status(204).json();
  } catch (error) {
    next(new AppError(500, 'Failed to delete post', { error }));
  }
};
