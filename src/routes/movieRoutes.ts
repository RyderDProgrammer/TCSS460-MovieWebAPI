import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

const router = Router();

// GET /movies - all movies with pagination
router.get('/', movieController.getAllMovies);

// GET /movies/:id - specific movie details
router.get('/:id', movieController.getMovieById);

export default router;