import express, { Router } from 'express';
import {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genreController';

const router: Router = express.Router();

// GET /genres - List all genres
router.get('/', getAllGenres);

// GET /genres/:genre_id - Get genre by ID
router.get('/:genre_id', getGenreById);

// POST /genres - Create a new genre
router.post('/', createGenre);

// PUT /genres/:genre_id - Update a genre
router.put('/:genre_id', updateGenre);

// DELETE /genres/:genre_id - Delete a genre
router.delete('/:genre_id', deleteGenre);

export default router;