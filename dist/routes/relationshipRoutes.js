import express from 'express';
import { getAllMovieGenres, createMovieGenre, deleteMovieGenre, getAllMovieCast, getMovieCastById, createMovieCast, updateMovieCast, deleteMovieCast, getAllMovieDirectors, createMovieDirector, deleteMovieDirector, getAllMovieProducers, createMovieProducer, deleteMovieProducer, getAllMovieStudios, createMovieStudio, deleteMovieStudio } from '../controllers/relationshipController.js';
const router = express.Router();
// ===== MOVIE GENRES =====
// GET /movie_genres - List movie-genre associations
router.get('/movie_genres', getAllMovieGenres);
// POST /movie_genres - Associate a movie with a genre
router.post('/movie_genres', createMovieGenre);
// DELETE /movie_genres/:movie_genre_id - Remove movie-genre association
router.delete('/movie_genres/:movie_genre_id', deleteMovieGenre);
// ===== MOVIE CAST =====
// GET /movie_cast - List cast entries
router.get('/movie_cast', getAllMovieCast);
// GET /movie_cast/:uniqueId - Get cast entry by ID
router.get('/movie_cast/:uniqueId', getMovieCastById);
// POST /movie_cast - Add a cast member to a movie
router.post('/movie_cast', createMovieCast);
// PUT /movie_cast/:uniqueId - Update cast entry
router.put('/movie_cast/:uniqueId', updateMovieCast);
// DELETE /movie_cast/:uniqueId - Remove cast entry
router.delete('/movie_cast/:uniqueId', deleteMovieCast);
// ===== MOVIE DIRECTORS =====
// GET /movie_directors - List movie-director associations
router.get('/movie_directors', getAllMovieDirectors);
// POST /movie_directors - Add a director to a movie
router.post('/movie_directors', createMovieDirector);
// DELETE /movie_directors/:movie_director_id - Remove movie-director association
router.delete('/movie_directors/:movie_director_id', deleteMovieDirector);
// ===== MOVIE PRODUCERS =====
// GET /movie_producers - List movie-producer associations
router.get('/movie_producers', getAllMovieProducers);
// POST /movie_producers - Add a producer to a movie
router.post('/movie_producers', createMovieProducer);
// DELETE /movie_producers/:movie_producer_id - Remove movie-producer association
router.delete('/movie_producers/:movie_producer_id', deleteMovieProducer);
// ===== MOVIE STUDIOS =====
// GET /movie_studios - List movie-studio associations
router.get('/movie_studios', getAllMovieStudios);
// POST /movie_studios - Associate a studio with a movie
router.post('/movie_studios', createMovieStudio);
// DELETE /movie_studios/:movie_studios_id - Remove movie-studio association
router.delete('/movie_studios/:movie_studios_id', deleteMovieStudio);
export default router;
//# sourceMappingURL=relationshipRoutes.js.map