import { Router, Request, Response } from 'express';
import movieRoutes from './movieRoutes.js';
import * as movieController from '../controllers/movieController.js';

const router = Router();

// Mount movie routes
router.use('/movies', movieRoutes);

// Special endpoint for movies by year (keep at root level)
router.get('/moviesbyyear', movieController.getMoviesByYear);

export default router;