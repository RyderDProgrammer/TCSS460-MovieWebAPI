import express, { Router, Request, Response, NextFunction } from 'express';
import {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  getMoviesByYear
} from '../controllers/movieController';

const router: Router = express.Router();

// GET /movies - List movies with pagination and search
router.get('/', getAllMovies);

// GET /moviesbyyear - Get movies by year (already implemented)
router.get('/moviesbyyear', getMoviesByYear);

// GET /movies/:movie_id - Get movie by ID
router.get('/:movie_id', getMovieById);

// POST /movies - Create a new movie
router.post('/', createMovie);

// PUT /movies/:movie_id - Update a movie
router.put('/:movie_id', updateMovie);

// DELETE /movies/:movie_id - Delete a movie
router.delete('/:movie_id', deleteMovie);

export default router;