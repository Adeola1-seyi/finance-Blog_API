import prisma from '../../prisma/index.js';
import { AppError } from '../utils/error.js';

const Blog = prisma.blog;

export const createBlog = async (req, res, next) => {
  const { title, description, coverImageUrl } = req.body;

  if (!title || !description) {
    return next(new AppError(400, 'Title and description are required'));
  }

  try {
    const blog = await Blog.create({
      data: { title, description, coverImageUrl },
    });
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    next(new AppError(500, 'Failed to create blog', { error }));
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.findMany({
      include: { posts: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ blogs });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve blogs', { error }));
  }
};

export const getBlog = async (req, res, next) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!blog) {
      return next(new AppError(404, 'Blog not found'));
    }

    res.status(200).json({ blog });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve blog', { error }));
  }
};

export const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, coverImageUrl } = req.body;

  try {
    const existingBlog = await Blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return next(new AppError(404, 'Blog not found'));
    }

    const blog = await Blog.update({
      where: { id },
      data: { title, description, coverImageUrl },
    });

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    next(new AppError(500, 'Failed to update blog', { error }));
  }
};

export const deleteBlog = async (req, res, next) => {
  const { id } = req.params;

  try {
    const existingBlog = await Blog.findUnique({ where: { id } });
    if (!existingBlog) {
      return next(new AppError(404, 'Blog not found'));
    }

    await Blog.delete({ where: { id } });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    next(new AppError(500, 'Failed to delete blog', { error }));
  }
};
