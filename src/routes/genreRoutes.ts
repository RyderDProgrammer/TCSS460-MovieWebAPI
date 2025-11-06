import express, { Router } from 'express';
import {
  getAllGenres,
  getGenreByName,
  createGenre,
  updateGenre,
  deleteGenre
} from '../controllers/genreController.js';

const router: Router = express.Router();

// GET /genres - List all genres
router.get('/', getAllGenres);

// GET /genres/:genre_name - Get genre by name
router.get('/:genre_name', getGenreByName);

// POST /genres - Create a new genre
router.post('/', createGenre);

// PUT /genres/:genre_id - Update a genre by ID
router.put('/:genre_id', updateGenre);

// DELETE /genres/:genre_id - Delete a genre by ID
router.delete('/:genre_id', deleteGenre);

export default router;