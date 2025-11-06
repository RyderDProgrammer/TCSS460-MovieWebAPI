import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// GET /genres - List all genres
export const getAllGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Genres ORDER BY genre_name';
    const genres = await query(sql, []);

    res.status(200).json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /genres/:genre_name - Get genre by name
export const getGenreByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const genreName = req.params.genre_name;

    if (!genreName) {
      res.status(400).json({ error: 'Invalid genre name' });
      return;
    }

    const sql = 'SELECT * FROM Genres WHERE LOWER(genre_name) LIKE LOWER(?)';
    const genres = await query(sql, [`%${genreName}%`]);

    if (genres.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(genres);
  } catch (error) {
    console.error('Error fetching genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /genres/:genre_id - Get genre by ID
export const getGenreById = async (req: Request, res: Response): Promise<void> => {
  try {
    const genreId = parseInt(req.params.genre_id);

    if (isNaN(genreId)) {
      res.status(400).json({ error: 'Invalid genre ID' });
      return;
    }

    const sql = 'SELECT * FROM Genres WHERE genre_id = ?';
    const genres = await query(sql, [genreId]);

    if (genres.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(genres[0]);
  } catch (error) {
    console.error('Error fetching genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /genres - Create a new genre
export const createGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const sql = 'INSERT INTO Genres (genre_name) VALUES (?)';
    const result = await run(sql, [name]);

    const newGenre = await query('SELECT * FROM Genres WHERE genre_id = ?', [result.lastID]);

    res.status(201).json(newGenre[0]);
  } catch (error) {
    console.error('Error creating genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /genres/:genre_id - Update a genre
export const updateGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const genreId = parseInt(req.params.genre_id);

    if (isNaN(genreId)) {
      res.status(400).json({ error: 'Invalid genre ID' });
      return;
    }

    // Check if genre exists
    const existing = await query('SELECT * FROM Genres WHERE genre_id = ?', [genreId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const sql = 'UPDATE Genres SET genre_name = ? WHERE genre_id = ?';
    await run(sql, [name, genreId]);

    const updatedGenre = await query('SELECT * FROM Genres WHERE genre_id = ?', [genreId]);

    res.status(200).json(updatedGenre[0]);
  } catch (error) {
    console.error('Error updating genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /genres/:genre_id - Delete a genre
export const deleteGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const genreId = parseInt(req.params.genre_id);

    if (isNaN(genreId)) {
      res.status(400).json({ error: 'Invalid genre ID' });
      return;
    }

    // Check if genre exists
    const existing = await query('SELECT * FROM Genres WHERE genre_id = ?', [genreId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Genres WHERE genre_id = ?';
    await run(sql, [genreId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};