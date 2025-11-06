import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// ==================== MOVIE GENRES ====================

// GET /movie_genres - List movie-genre associations
export const getAllMovieGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Movie_Genres';
    const movieGenres = await query(sql, []);
    res.status(200).json(movieGenres);
  } catch (error) {
    console.error('Error fetching movie genres:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /movie_genres - Associate a movie with a genre
export const createMovieGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movie_id, genre_id } = req.body;

    if (!movie_id || !genre_id) {
      res.status(400).json({ error: 'movie_id and genre_id are required' });
      return;
    }

    const sql = 'INSERT INTO Movie_Genres (movie_id, genre_id) VALUES (?, ?)';
    const result = await run(sql, [movie_id, genre_id]);

    const newMovieGenre = await query(
      'SELECT * FROM Movie_Genres WHERE movie_genre_id = ?',
      [result.lastID]
    );

    res.status(201).json(newMovieGenre[0]);
  } catch (error) {
    console.error('Error creating movie genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /movie_genres/:movie_genre_id - Remove movie-genre association
export const deleteMovieGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieGenreId = parseInt(req.params.movie_genre_id);

    if (isNaN(movieGenreId)) {
      res.status(400).json({ error: 'Invalid movie_genre_id' });
      return;
    }

    const existing = await query(
      'SELECT * FROM Movie_Genres WHERE movie_genre_id = ?',
      [movieGenreId]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Movie_Genres WHERE movie_genre_id = ?';
    await run(sql, [movieGenreId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==================== MOVIE CAST ====================

// GET /movie_cast - List cast entries
export const getAllMovieCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Cast ORDER BY cast_order';
    const movieCast = await query(sql, []);
    res.status(200).json(movieCast);
  } catch (error) {
    console.error('Error fetching movie cast:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /movie_cast/:uniqueId - Get cast entry by ID
export const getMovieCastById = async (req: Request, res: Response): Promise<void> => {
  try {
    const uniqueId = parseInt(req.params.uniqueId);

    if (isNaN(uniqueId)) {
      res.status(400).json({ error: 'Invalid uniqueId' });
      return;
    }

    const sql = 'SELECT * FROM Cast WHERE uniqueId = ?';
    const cast = await query(sql, [uniqueId]);

    if (cast.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(cast[0]);
  } catch (error) {
    console.error('Error fetching movie cast:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /movie_cast - Add a cast member to a movie
export const createMovieCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movie_id, person_id, character_name, cast_order } = req.body;

    if (!movie_id || !person_id) {
      res.status(400).json({ error: 'movie_id and person_id are required' });
      return;
    }

    const sql = `
      INSERT INTO Cast (movie_id, person_id, character_name, cast_order)
      VALUES (?, ?, ?, ?)
    `;
    const result = await run(sql, [
      movie_id,
      person_id,
      character_name || null,
      cast_order || null
    ]);

    const newCast = await query('SELECT * FROM Cast WHERE uniqueId = ?', [result.lastID]);

    res.status(201).json(newCast[0]);
  } catch (error) {
    console.error('Error creating movie cast:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /movie_cast/:uniqueId - Update cast entry
export const updateMovieCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const uniqueId = parseInt(req.params.uniqueId);

    if (isNaN(uniqueId)) {
      res.status(400).json({ error: 'Invalid uniqueId' });
      return;
    }

    const existing = await query('SELECT * FROM Cast WHERE uniqueId = ?', [uniqueId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { movie_id, person_id, character_name, cast_order } = req.body;

    if (!movie_id || !person_id) {
      res.status(400).json({ error: 'movie_id and person_id are required' });
      return;
    }

    const sql = `
      UPDATE Cast 
      SET movie_id = ?, person_id = ?, character_name = ?, cast_order = ?
      WHERE uniqueId = ?
    `;
    await run(sql, [
      movie_id,
      person_id,
      character_name || null,
      cast_order || null,
      uniqueId
    ]);

    const updatedCast = await query('SELECT * FROM Cast WHERE uniqueId = ?', [uniqueId]);

    res.status(200).json(updatedCast[0]);
  } catch (error) {
    console.error('Error updating movie cast:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /movie_cast/:uniqueId - Remove cast entry
export const deleteMovieCast = async (req: Request, res: Response): Promise<void> => {
  try {
    const uniqueId = parseInt(req.params.uniqueId);

    if (isNaN(uniqueId)) {
      res.status(400).json({ error: 'Invalid uniqueId' });
      return;
    }

    const existing = await query('SELECT * FROM Cast WHERE uniqueId = ?', [uniqueId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Cast WHERE uniqueId = ?';
    await run(sql, [uniqueId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie cast:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==================== MOVIE DIRECTORS ====================

// GET /movie_directors - List movie-director associations
export const getAllMovieDirectors = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Movie_Directors';
    const movieDirectors = await query(sql, []);
    res.status(200).json(movieDirectors);
  } catch (error) {
    console.error('Error fetching movie directors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /movie_directors - Add a director to a movie
export const createMovieDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movie_id, person_id } = req.body;

    if (!movie_id || !person_id) {
      res.status(400).json({ error: 'movie_id and person_id are required' });
      return;
    }

    const sql = 'INSERT INTO Movie_Directors (movie_id, person_id) VALUES (?, ?)';
    const result = await run(sql, [movie_id, person_id]);

    const newMovieDirector = await query(
      'SELECT * FROM Movie_Directors WHERE movie_director_id = ?',
      [result.lastID]
    );

    res.status(201).json(newMovieDirector[0]);
  } catch (error) {
    console.error('Error creating movie director:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /movie_directors/:movie_director_id - Remove movie-director association
export const deleteMovieDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieDirectorId = parseInt(req.params.movie_director_id);

    if (isNaN(movieDirectorId)) {
      res.status(400).json({ error: 'Invalid movie_director_id' });
      return;
    }

    const existing = await query(
      'SELECT * FROM Movie_Directors WHERE movie_director_id = ?',
      [movieDirectorId]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Movie_Directors WHERE movie_director_id = ?';
    await run(sql, [movieDirectorId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie director:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==================== MOVIE PRODUCERS ====================

// GET /movie_producers - List movie-producer associations
export const getAllMovieProducers = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Movie_Producers';
    const movieProducers = await query(sql, []);
    res.status(200).json(movieProducers);
  } catch (error) {
    console.error('Error fetching movie producers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /movie_producers - Add a producer to a movie
export const createMovieProducer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movie_id, person_id } = req.body;

    if (!movie_id || !person_id) {
      res.status(400).json({ error: 'movie_id and person_id are required' });
      return;
    }

    const sql = 'INSERT INTO Movie_Producers (movie_id, person_id) VALUES (?, ?)';
    const result = await run(sql, [movie_id, person_id]);

    const newMovieProducer = await query(
      'SELECT * FROM Movie_Producers WHERE movie_producer_id = ?',
      [result.lastID]
    );

    res.status(201).json(newMovieProducer[0]);
  } catch (error) {
    console.error('Error creating movie producer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /movie_producers/:movie_producer_id - Remove movie-producer association
export const deleteMovieProducer = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieProducerId = parseInt(req.params.movie_producer_id);

    if (isNaN(movieProducerId)) {
      res.status(400).json({ error: 'Invalid movie_producer_id' });
      return;
    }

    const existing = await query(
      'SELECT * FROM Movie_Producers WHERE movie_producer_id = ?',
      [movieProducerId]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Movie_Producers WHERE movie_producer_id = ?';
    await run(sql, [movieProducerId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie producer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ==================== MOVIE STUDIOS ====================

// GET /movie_studios - List movie-studio associations
export const getAllMovieStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Movie_Studios';
    const movieStudios = await query(sql, []);
    res.status(200).json(movieStudios);
  } catch (error) {
    console.error('Error fetching movie studios:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /movie_studios - Associate a studio with a movie
export const createMovieStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movie_id, studio_id } = req.body;

    if (!movie_id || !studio_id) {
      res.status(400).json({ error: 'movie_id and studio_id are required' });
      return;
    }

    const sql = 'INSERT INTO Movie_Studios (movie_id, studio_id) VALUES (?, ?)';
    const result = await run(sql, [movie_id, studio_id]);

    const newMovieStudio = await query(
      'SELECT * FROM Movie_Studios WHERE movie_studios_id = ?',
      [result.lastID]
    );

    res.status(201).json(newMovieStudio[0]);
  } catch (error) {
    console.error('Error creating movie studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /movie_studios/:movie_studios_id - Remove movie-studio association
export const deleteMovieStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const movieStudiosId = parseInt(req.params.movie_studios_id);

    if (isNaN(movieStudiosId)) {
      res.status(400).json({ error: 'Invalid movie_studios_id' });
      return;
    }

    const existing = await query(
      'SELECT * FROM Movie_Studios WHERE movie_studios_id = ?',
      [movieStudiosId]
    );

    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Movie_Studios WHERE movie_studios_id = ?';
    await run(sql, [movieStudiosId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};