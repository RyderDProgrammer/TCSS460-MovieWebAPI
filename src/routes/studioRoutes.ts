import express, { Router } from 'express';
import {
  getAllStudios,
  getStudioByName,
  createStudio,
  updateStudio,
  deleteStudio
} from '../controllers/studioController.js';

const router: Router = express.Router();

// GET /studios - List all studios
router.get('/', getAllStudios);

// GET /studios/:studio_name - Get studio by name
router.get('/:studio_name', getStudioByName);

// POST /studios - Create a new studio
router.post('/', createStudio);

// PUT /studios/:studio_id - Update a studio by ID
router.put('/:studio_id', updateStudio);

// DELETE /studios/:studio_id - Delete a studio by ID
router.delete('/:studio_id', deleteStudio);

export default router;