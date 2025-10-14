import prisma from '../prisma/index.js';
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
    if (!comment) {
      return next(new AppError(404, 'Comment not found'));
    }
    res.status(200).json({ comment });
  } catch (error) {
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

export const replyToComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
    try {
    const reply = await Comment.create({
      data: {
        content,
        parentComment: { connect: { id: commentId } },  
      },
    });
    res.status(201).json({ reply });
  } catch (error) {
    next(new AppError(500, 'Failed to reply to comment', { error }));
  }
};

export const getRepliesForComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const replies = await Comment.findMany({
        where: { parentCommentId: commentId },      
        include: { user: true },        
    }); 
    res.status(200).json({ replies });
  }
    catch (error) {     
    next(new AppError(500, 'Failed to retrieve replies', { error }));
  }
};

export const getCommentCountForPost = async (req, res, next) => {
  const { postId } = req.params;
    try {   
    const count = await Comment.count({ where: { postId } });
    res.status(200).json({ count });    
    } catch (error) {
    next(new AppError(500, 'Failed to retrieve comment count', { error })); 
    }   
};  

export const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const comment = await Comment.delete({
      where: { id },
    });
    if (!comment) {
      return next(new AppError(404, 'Comment not found'));
    }
    res.status(204).json();
  } catch (error) {
    next(new AppError(500, 'Failed to delete comment', { error }));
  }
};
