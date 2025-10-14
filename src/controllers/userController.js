import prisma from '../prisma/index.js';
import { generateUserToken } from '../middleware/authMiddleware.js';
import { AppError } from '../utils/error.js';   
import bcrypt from 'bcryptjs';


const User = prisma.user;

export const createUser = async (req, res, next) => {
  const { name,email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError(400, 'Name, email, and password are required'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = { name, email, password: hashedPassword };   

  try {
    const user = await User.create({
      data: userData,
    });
    const token = generateUserToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    next(new AppError(500, 'Failed to create user', { error }));
  }
};

export const loginUser = async (req, res, next) => {    
    const { email, password } = req.body;   
    if (!email || !password) {  
    return next(new AppError(400, 'Email and password are required'));      
    }
    try {
    const user = await User.findUnique({
        where: { email },
    }); 
    if (!user) {
        return next(new AppError(404, 'User not found'));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError(401, 'Invalid password'));
    }       
    const token = generateUserToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    next(new AppError(500, 'Failed to login', { error }));
  }
};

export const getAllUsers = async (req, res, next) => {
    try {
    const users = await User.findMany();    
    res.status(200).json({ users });
  } catch (error) { 
    next(new AppError(500, 'Failed to retrieve users', { error }));
    }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;    
    try {   
    const user = await User.findUnique({
        where: { id },
        data: { name, email },
    });
    if (!user) {
        return next(new AppError(404, 'User not found'));   
    }
    res.status(200).json({ user });
  } catch (error) {
    next(new AppError(500, 'Failed to retrieve user', { error }));
  } 
};

export const updatePassword  = async(req, res, next) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;    
    if (!oldPassword || !newPassword) {
    return next(new AppError(400, 'Old and new passwords are required'));
    }       
    try {
    const user = await User.findUnique({
        where: { id },
    }); 
    if (!user) {
        return next(new AppError(404, 'User not found'));
    }
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
        return next(new AppError(401, 'Old password is incorrect'));
    } 
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);   
    await User.update({
        where: { id },
        data: { password: hashedNewPassword },
    });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    next(new AppError(500, 'Failed to update password', { error }));
  } 
};  

export const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;  
  if (!email || !newPassword) {
    return next(new AppError(400, 'Email and new password are required'));
  }
  try {
    const user = await User.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new AppError(404, 'User not found'));
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.update({
      where: { email },
      data: { password: hashedNewPassword },
    });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(new AppError(500, 'Failed to reset password', { error }));
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email } = req.body; 
    try {
    const user = await User.update({
        where: { id },
        data: { name, email },
    });
    if (!user) {
        return next(new AppError(404, 'User not found'));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(new AppError(500, 'Failed to update user', { error }));
  }
};
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.delete({
      where: { id },
    });
    if (!user) {
      return next(new AppError(404, 'User not found'));
    }
    res.status(204).json();
  } catch (error) {
    next(new AppError(500, 'Failed to delete user', { error }));
  }
};  

export const logoutUser = async (req, res, next) => {
  res.status(200).json({ message: 'User logged out successfully' });
};

export const getCurrentUser = async (req, res, next) => {
  if (!req.user) {
    return next(new AppError(401, 'Not authenticated'));
  }
  res.status(200).json({ user: req.user });    
};  

export const promoteToAdmin = async (req, res, next) => {
  const { id } = req.params;
  try { 
    const user = await User.update({
      where: { id },
      data: { isAdmin: true },
    });             
    if (!user) {
      return next(new AppError(404, 'User not found'));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(new AppError(500, 'Failed to promote user', { error }));
  }
};  

export const demoteFromAdmin = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.update({
      where: { id },
      data: { isAdmin: false },
    });
    if (!user) {
      return next(new AppError(404, 'User not found'));
    }
    res.status(200).json({ user });
  } catch (error) {
    next(new AppError(500, 'Failed to demote user', { error }));
  }
};

