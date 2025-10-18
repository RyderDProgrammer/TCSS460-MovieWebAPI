const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Open the SQLite database in the project folder
const DB_PATH = path.join(__dirname, 'SQL Scripts', 'movies.db');

// If the DB file is missing at startup, fail fast so Render shows an error in logs
if (!fs.existsSync(DB_PATH)) {
  console.error(`Database file not found at ${DB_PATH}. If you intended to include the DB in the repo, commit it or run the import on startup.`);
  // exit with non-zero so the hosting platform marks the deploy as failed and shows logs
  process.exit(1);
}

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite DB at', DB_PATH);
  }
});

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic root route
app.get('/', (req, res) => {
  res.json({ message: 'Movies API (SQLite) - see /movies' });
});

// GET /movies - simple pagination and optional title filter
app.get('/movies', (req, res) => {
  const q = req.query.q || null; // search query for title
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);
  const offset = (page - 1) * pageSize;

  let params = [];
  let sql = `SELECT movie_id, title, release_date, runtime_in_minutes, mpa_rating FROM Movies`;
  if (q) {
    sql += ` WHERE title LIKE ?`;
    params.push(`%${q}%`);
  }
  sql += ` ORDER BY release_date DESC NULLS LAST LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ page, pageSize, results: rows });
  });
});

// GET /moviesbyyear?year=YYYY - return all movies released in the given year
app.get('/moviesbyyear', (req, res) => {
  const year = req.query.year;
  if (!year || !/^[0-9]{4}$/.test(year)) {
    return res.status(400).json({ error: 'Please provide a valid year as ?year=YYYY' });
  }

  // SQLite stores release_date as DATE; we query by the year prefix
  // First try strftime (works when dates are ISO-like). Many dates in the dataset are like M/D/YY
  const sqlStrftime = `
    SELECT movie_id, title, release_date, runtime_in_minutes, mpa_rating
    FROM Movies
    WHERE strftime('%Y', release_date) = ?
    ORDER BY release_date DESC
  `;

  db.all(sqlStrftime, [year], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows && rows.length > 0) {
      return res.json({ year, count: rows.length, movies: rows });
    }

    // Fallback: many release_date values are stored as M/D/YY (e.g. 8/4/25). Try matching the two-digit year or occurrences of the full year.
    const yy = year.slice(-2);
    const likeTwoDigit = `%/${yy}`;      // matches '8/4/19' etc
    const likeFull = `%${year}%`;        // matches any '2019' forms if present

    const sqlLike = `
      SELECT movie_id, title, release_date, runtime_in_minutes, mpa_rating
      FROM Movies
      WHERE release_date LIKE ? OR release_date LIKE ?
      ORDER BY release_date DESC
    `;

    db.all(sqlLike, [likeTwoDigit, likeFull], (e2, rows2) => {
      if (e2) return res.status(500).json({ error: e2.message });
      return res.json({ year, count: rows2.length, movies: rows2 });
    });
  });
});

// GET /movies/:id - detailed movie with genres and cast (limited)
app.get('/movies/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });

  const movieSql = `SELECT * FROM Movies WHERE movie_id = ?`;
  db.get(movieSql, [id], (err, movie) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    // load genres
    const genresSql = `
      SELECT g.genre_name FROM Movie_Genres mg
      JOIN Genres g ON mg.genre_id = g.genre_id
      WHERE mg.movie_id = ?
    `;

    db.all(genresSql, [id], (gErr, genres) => {
      if (gErr) return res.status(500).json({ error: gErr.message });

      // load cast (first 10)
      const castSql = `
        SELECT a.actor_name, c.character_name FROM Cast c
        JOIN Actors a ON c.actor_id = a.actor_id
        WHERE c.movie_id = ?
        ORDER BY c.cast_id LIMIT 10
      `;

      db.all(castSql, [id], (cErr, cast) => {
        if (cErr) return res.status(500).json({ error: cErr.message });

        movie.genres = genres ? genres.map(g => g.genre_name) : [];
        movie.cast = cast || [];
        res.json(movie);
      });
    });
  });
});

// Graceful shutdown
function closeDbAndExit() {
  db.close(() => {
    console.log('Closed DB connection');
    process.exit(0);
  });
}

process.on('SIGTERM', closeDbAndExit);
process.on('SIGINT', closeDbAndExit);

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

module.exports = app;
