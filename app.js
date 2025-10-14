import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { AppError } from './utils/error.js';

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likeRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    ...(err.error && { error: err.error }),
  });
});

app.listen(3000, () => {    
  console.log('Server is running on port 3000');
}); 

export default app;
