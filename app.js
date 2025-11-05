import express from 'express';
import dotenv from 'dotenv';
import { AppError } from './src/utils/error.js';

// Route imports
import userRoutes from './src/routes/userRoutes.js';
import blogRoutes from './src/routes/blogRoutes.js';
import postRoutes from './src/routes/postRoutes.js';
import commentsRoutes from './src/routes/commentsRoutes.js';
import likeRoutes from './src/routes/likeRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likeRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    ...(err.error && { error: err.error }),
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
