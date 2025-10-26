import express, { Router } from 'express';
import {
  getAllActors,
  getActorById,
  getActorMovies,
  createActor,
  updateActor,
  deleteActor
} from '../controllers/actorsController.js';

const router: Router = express.Router();

// GET /actors - List all actors
router.get('/', getAllActors);

// GET /actors/:actor_id - Get actor by ID
router.get('/:actor_id', getActorById);

// GET /actors/:actor_id/movies - Get all movies for an actor
router.get('/:actor_id/movies', getActorMovies);

// POST /actors - Create a new actor
router.post('/', createActor);

// PUT /actors/:actor_id - Update an actor
router.put('/:actor_id', updateActor);

// DELETE /actors/:actor_id - Delete an actor
router.delete('/:actor_id', deleteActor);

export default router;