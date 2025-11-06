import { Request, Response } from 'express';
import { db } from '../core/utilities/database.js';
import { Movie, Genre, CastMember, MovieWithDetails } from '../types/movieTypes.js';

/**
 * GET /movies - Get all movies with pagination and optional title search
 */
export const getAllMovies = (req: Request, res: Response) => {
  const q = (req.query.q as string) || null;
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
  const offset = (page - 1) * pageSize;

  let params: (string | number)[] = [];
  let sql = `SELECT movie_id, title, release_date, runtime_in_minutes, mpa_rating FROM Movies`;
  
  if (q) {
    sql += ` WHERE title LIKE ?`;
    params.push(`%${q}%`);
  }
  
  sql += ` ORDER BY release_date DESC NULLS LAST LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  db.all(sql, params, (err: Error | null, rows: Movie[]) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ page, pageSize, results: rows });
  });
};

/**
 * GET /moviesbyyear?year=YYYY - Get all movies released in a specific year
 */
export const getMoviesByYear = (req: Request, res: Response) => {
  const year = req.query.year as string;
  
  if (!year || !/^[0-9]{4}$/.test(year)) {
    return res.status(400).json({ error: 'Please provide a valid year as ?year=YYYY' });
  }

  const sqlStrftime = `
    SELECT movie_id, title, release_date, runtime_in_minutes, mpa_rating
    FROM Movies
    WHERE strftime('%Y', release_date) = ?
    ORDER BY release_date DESC
  `;

  db.all(sqlStrftime, [year], (err: Error | null, rows: Movie[]) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (rows && rows.length > 0) {
      return res.json({ year, count: rows.length, movies: rows });
    }

    // Fallback: many release_date values are stored as M/D/YY
    const yy = year.slice(-2);
    const likeTwoDigit = `%/${yy}`;
    const likeFull = `%${year}%`;

    const sqlLike = `
      SELECT movie_id, title, release_date, runtime_in_minutes, mpa_rating
      FROM Movies
      WHERE release_date LIKE ? OR release_date LIKE ?
      ORDER BY release_date DESC
    `;

    db.all(sqlLike, [likeTwoDigit, likeFull], (e2: Error | null, rows2: Movie[]) => {
      if (e2) return res.status(500).json({ error: e2.message });
      return res.json({ year, count: rows2.length, movies: rows2 });
    });
  });
};

/**
 * GET /movies/:title - Get detailed movie information by title with genres and cast
 */
export const getMovieByTitle = (req: Request, res: Response) => {
  const title = req.params.title;

  if (!title) return res.status(400).json({ error: 'Invalid title' });

  const movieSql = `SELECT * FROM Movies WHERE LOWER(title) LIKE LOWER(?)`;

  db.get(movieSql, [`%${title}%`], (err: Error | null, movie: Movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    // Load genres
    const genresSql = `
      SELECT g.genre_name FROM Movie_Genres mg
      JOIN Genres g ON mg.genre_id = g.genre_id
      WHERE mg.movie_id = ?
    `;

    db.all(genresSql, [movie.movie_id], (gErr: Error | null, genres: Genre[]) => {
      if (gErr) return res.status(500).json({ error: gErr.message });

      // Load cast (first 10)
      const castSql = `
        SELECT a.actor_name, c.character_name FROM Cast c
        JOIN Actors a ON c.actor_id = a.actor_id
        WHERE c.movie_id = ?
        ORDER BY c.cast_id LIMIT 10
      `;

      db.all(castSql, [movie.movie_id], (cErr: Error | null, cast: CastMember[]) => {
        if (cErr) return res.status(500).json({ error: cErr.message });

        const movieWithDetails: MovieWithDetails = {
          ...movie,
          genres: genres ? genres.map(g => g.genre_name) : [],
          cast: cast || []
        };

        res.json(movieWithDetails);
      });
    });
  });
};

/**
 * GET /movies/:id - Get detailed movie information with genres and cast
 */
export const getMovieById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (!id) return res.status(400).json({ error: 'Invalid id' });

  const movieSql = `SELECT * FROM Movies WHERE movie_id = ?`;
  
  db.get(movieSql, [id], (err: Error | null, movie: Movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    // Load genres
    const genresSql = `
      SELECT g.genre_name FROM Movie_Genres mg
      JOIN Genres g ON mg.genre_id = g.genre_id
      WHERE mg.movie_id = ?
    `;

    db.all(genresSql, [id], (gErr: Error | null, genres: Genre[]) => {
      if (gErr) return res.status(500).json({ error: gErr.message });

      // Load cast (first 10)
      const castSql = `
        SELECT a.actor_name, c.character_name FROM Cast c
        JOIN Actors a ON c.actor_id = a.actor_id
        WHERE c.movie_id = ?
        ORDER BY c.cast_id LIMIT 10
      `;

      db.all(castSql, [id], (cErr: Error | null, cast: CastMember[]) => {
        if (cErr) return res.status(500).json({ error: cErr.message });

        const movieWithDetails: MovieWithDetails = {
          ...movie,
          genres: genres ? genres.map(g => g.genre_name) : [],
          cast: cast || []
        };
        
        res.json(movieWithDetails);
      });
    });
  });
};

/**
 * POST /movies - Create a new movie
 */
export const createMovie = (req: Request, res: Response) => {
  const {
    title,
    original_title,
    release_date,
    runtime_in_minutes,
    overview,
    budget,
    revenue,
    mpa_rating,
    collection,
    poster_url,
    backdrop_url
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const sql = `
    INSERT INTO Movies (
      title, original_title, release_date, runtime_in_minutes, overview,
      budget, revenue, mpa_rating, collection, poster_url, backdrop_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title,
    original_title || null,
    release_date || null,
    runtime_in_minutes || null,
    overview || null,
    budget || null,
    revenue || null,
    mpa_rating || null,
    collection || null,
    poster_url || null,
    backdrop_url || null
  ];

  db.run(sql, params, function(err: Error | null) {
    if (err) {
      console.error('Error creating movie:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Fetch the newly created movie
    const newId = this.lastID;
    db.get('SELECT * FROM Movies WHERE movie_id = ?', [newId], (getErr: Error | null, movie: Movie) => {
      if (getErr) {
        return res.status(500).json({ error: getErr.message });
      }
      res.status(201).json(movie);
    });
  });
};

/**
 * PUT /movies/:id - Update an existing movie
 */
export const updateMovie = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!id) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  // Check if movie exists
  db.get('SELECT * FROM Movies WHERE movie_id = ?', [id], (checkErr: Error | null, existing: Movie) => {
    if (checkErr) {
      return res.status(500).json({ error: checkErr.message });
    }
    if (!existing) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const {
      title,
      original_title,
      release_date,
      runtime_in_minutes,
      overview,
      budget,
      revenue,
      mpa_rating,
      collection,
      poster_url,
      backdrop_url
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const sql = `
      UPDATE Movies SET
        title = ?,
        original_title = ?,
        release_date = ?,
        runtime_in_minutes = ?,
        overview = ?,
        budget = ?,
        revenue = ?,
        mpa_rating = ?,
        collection = ?,
        poster_url = ?,
        backdrop_url = ?
      WHERE movie_id = ?
    `;

    const params = [
      title,
      original_title || null,
      release_date || null,
      runtime_in_minutes || null,
      overview || null,
      budget || null,
      revenue || null,
      mpa_rating || null,
      collection || null,
      poster_url || null,
      backdrop_url || null,
      id
    ];

    db.run(sql, params, (err: Error | null) => {
      if (err) {
        console.error('Error updating movie:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Fetch the updated movie
      db.get('SELECT * FROM Movies WHERE movie_id = ?', [id], (getErr: Error | null, movie: Movie) => {
        if (getErr) {
          return res.status(500).json({ error: getErr.message });
        }
        res.status(200).json(movie);
      });
    });
  });
};

/**
 * DELETE /movies/:id - Delete a movie
 */
export const deleteMovie = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  if (!id) {
    return res.status(400).json({ error: 'Invalid movie ID' });
  }

  // Check if movie exists
  db.get('SELECT * FROM Movies WHERE movie_id = ?', [id], (checkErr: Error | null, existing: Movie) => {
    if (checkErr) {
      return res.status(500).json({ error: checkErr.message });
    }
    if (!existing) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const sql = 'DELETE FROM Movies WHERE movie_id = ?';

    db.run(sql, [id], (err: Error | null) => {
      if (err) {
        console.error('Error deleting movie:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(204).send();
    });
  });
};