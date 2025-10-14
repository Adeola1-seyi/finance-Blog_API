import jwt from 'jsonwebtoken';
import prisma from '../prisma/index.js';
import { AppError } from '../utils/error.js';

const User = prisma.user;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRES_IN;

export const generateUserToken = (user) => {
  if (!user || !user.id) {
    throw new AppError(400, 'User object with valid id is required');
  }

  return jwt.sign({ id: user.id }, jwtSecret, {
    expiresIn: jwtExpiration || '1d',
  });
};

export const authenticateUserToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Invalid Auth Header format'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new AppError(404, 'User not found'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(403, 'Invalid or Expired Token'));
  }
};
