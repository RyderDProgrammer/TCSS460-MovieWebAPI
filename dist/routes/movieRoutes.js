// movieRoutes.ts
import express from 'express';
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/movieController.js';
const router = express.Router();
// GET /movies - List movies
router.get('/', getAllMovies);
// GET /movies/:id - Get movie by ID
router.get('/:id', getMovieById);
// POST /movies - Create a new movie
router.post('/', createMovie);
// PUT /movies/:id - Update a movie
router.put('/:id', updateMovie);
// DELETE /movies/:id - Delete a movie
router.delete('/:id', deleteMovie);
export default router;
//# sourceMappingURL=movieRoutes.js.map