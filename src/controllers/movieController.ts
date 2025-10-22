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