import express, { Router } from 'express';
import {
  getAllDirectors,
  getDirectorById,
  getDirectorMovies,
  createDirector,
  updateDirector,
  deleteDirector
} from '../controllers/directorsController.js';

const router: Router = express.Router();

// GET /directors - List all directors
router.get('/', getAllDirectors);

// GET /directors/:director_id - Get director by ID
router.get('/:director_id', getDirectorById);

// GET /directors/:director_id/movies - Get all movies for a director
router.get('/:director_id/movies', getDirectorMovies);

// POST /directors - Create a new director
router.post('/', createDirector);

// PUT /directors/:director_id - Update a director
router.put('/:director_id', updateDirector);

// DELETE /directors/:director_id - Delete a director
router.delete('/:director_id', deleteDirector);

export default router;