const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Open the SQLite database in the project folder
const DB_PATH = path.join(__dirname, 'SQL Scripts', 'movies.db');
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
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
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
