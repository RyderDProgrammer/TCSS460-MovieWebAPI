import express, { Router } from 'express';
import {
  getAllActors,
  getActorById,
  getActorByName,
  getActorMovies,
  createActor,
  updateActor,
  deleteActor
} from '../controllers/actorsController.js';

const router: Router = express.Router();

// GET /actors - List all actors
router.get('/', getAllActors);

// GET /actors/:actor_name - Get actor by name (must be before /:actor_id/movies)
router.get('/:actor_name', getActorByName);

// GET /actors/:actor_id/movies - Get all movies for an actor
router.get('/:actor_id/movies', getActorMovies);

// POST /actors - Create a new actor
router.post('/', createActor);

// PUT /actors/:actor_id - Update an actor by ID
router.put('/:actor_id', updateActor);

// DELETE /actors/:actor_id - Delete an actor by ID
router.delete('/:actor_id', deleteActor);

export default router;