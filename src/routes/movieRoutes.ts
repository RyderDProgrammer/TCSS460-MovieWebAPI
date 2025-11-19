// movieRoutes.ts
import express, { Router } from 'express';
import {
  getAllMovies,
  getMovieByTitle,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';

const router: Router = express.Router();

// GET /movies - List movies (simple list)
router.get('/', getAllMovies);

// GET /movies/title - Get movies by ID, title search, or all movies with details (A-Z)
// Uses query parameter ?q= for search (numeric for ID, string for title, empty/omitted for all)
router.get('/title', getMovieByTitle);

// POST /movies - Create a new movie
router.post('/', createMovie);

// PUT /movies/:id - Update a movie by ID
router.put('/:id', updateMovie);

// DELETE /movies/:id - Delete a movie by ID
router.delete('/:id', deleteMovie);

export default router;