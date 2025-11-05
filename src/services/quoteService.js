import axios from 'axios';
import { AppError } from '..src/utils/error.js';

export const getRandomQuote = async () => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    return { content, author };
  } catch (error) {
    throw new AppError(500, 'Failed to fetch quote', { error });
  }
};
