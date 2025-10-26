import { Router } from 'express';
import movieRoutes from './movieRoutes.js';
import genreRoutes from './genreRoutes.js';
import studioRoutes from './studioRoutes.js';
import peopleRoutes from './peopleRoutes.js';
import relationshipRoutes from './relationshipRoutes.js';
import * as movieController from '../controllers/movieController.js';
import { validateApiKey } from '../core/utilities/envConfig.js';
const router = Router();
// Special endpoint for movies by year (no API key required per documentation)
router.get('/moviesbyyear', movieController.getMoviesByYear);
// Protected routes (require API key)
router.use('/movies', validateApiKey, movieRoutes);
router.use('/genres', validateApiKey, genreRoutes);
router.use('/studios', validateApiKey, studioRoutes);
router.use('/people', validateApiKey, peopleRoutes);
// Relationship routes (require API key)
router.use('/', validateApiKey, relationshipRoutes);
export default router;
//# sourceMappingURL=index.js.map