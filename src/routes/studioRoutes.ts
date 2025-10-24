import express, { Router } from 'express';
import {
  getAllStudios,
  getStudioById,
  createStudio,
  updateStudio,
  deleteStudio
} from '../controllers/studioController.js';

const router: Router = express.Router();

// GET /studios - List all studios
router.get('/', getAllStudios);

// GET /studios/:studio_id - Get studio by ID
router.get('/:studio_id', getStudioById);

// POST /studios - Create a new studio
router.post('/', createStudio);

// PUT /studios/:studio_id - Update a studio
router.put('/:studio_id', updateStudio);

// DELETE /studios/:studio_id - Delete a studio
router.delete('/:studio_id', deleteStudio);

export default router;