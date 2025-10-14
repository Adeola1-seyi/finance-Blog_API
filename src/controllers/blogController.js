import prisma from '../prisma/index.js';
import { AppError } from '../utils/error.js';

const Blog = prisma.blog;

export const createBlog = async (req, res, next) => {
  const  { title, description, coverImageUrl }  = req.body;
    try {
      const blog = await Blog.create({
        data: { title, description, coverImageUrl },
      });
      res.status(201).json({ blog });
    } catch (error) {
      next(new AppError(500, 'Failed to create blog', { error }));
    }
};

export const getAllBlogs = async (req, res, next) => {
    try {
      const blogs = await Blog.findMany();
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
    const blog = await Blog.update({
      where: { id },
      data: { title, description, coverImageUrl },
    });
    if (!blog) {
      return next(new AppError(404, 'Blog not found'));
    }
    res.status(200).json({ blog });
  } catch (error) {
    next(new AppError(500, 'Failed to update blog', { error }));
  }
};
export const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.delete({
      where: { id },
    });
    if (!blog) {
      return next(new AppError(404, 'Blog not found'));
    }
    res.status(204).json();
  } catch (error) {
    next(new AppError(500, 'Failed to delete blog', { error }));
  }
};
