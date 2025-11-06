import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// GET /directors - List all directors
export const getAllDirectors = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Directors ORDER BY director_name';
    const directors = await query(sql, []);

    res.status(200).json(directors);
  } catch (error) {
    console.error('Error fetching directors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /directors/:director_name - Get director by name
export const getDirectorByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const directorName = req.params.director_name;

    if (!directorName) {
      res.status(400).json({ error: 'Invalid director name' });
      return;
    }

    const sql = 'SELECT * FROM Directors WHERE LOWER(director_name) LIKE LOWER(?)';
    const directors = await query(sql, [`%${directorName}%`]);

    if (directors.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(directors);
  } catch (error) {
    console.error('Error fetching director:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /directors/:director_id/movies - Get all movies for a director
export const getDirectorMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const directorId = parseInt(req.params.director_id);

    if (isNaN(directorId)) {
      res.status(400).json({ error: 'Invalid director ID' });
      return;
    }

    const sql = `
      SELECT m.*
      FROM Movies m
      INNER JOIN Movie_Directors md ON m.movie_id = md.movie_id
      WHERE md.director_id = ?
      ORDER BY m.release_date DESC
    `;
    const movies = await query(sql, [directorId]);

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching director movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /directors - Create a new director
export const createDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    const { director_name } = req.body;

    if (!director_name) {
      res.status(400).json({ error: 'Director name is required' });
      return;
    }

    const sql = 'INSERT INTO Directors (director_name) VALUES (?)';
    const result = await run(sql, [director_name]);

    const newDirector = await query('SELECT * FROM Directors WHERE director_id = ?', [result.lastID]);

    res.status(201).json(newDirector[0]);
  } catch (error) {
    console.error('Error creating director:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /directors/:director_id - Update a director
export const updateDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    const directorId = parseInt(req.params.director_id);

    if (isNaN(directorId)) {
      res.status(400).json({ error: 'Invalid director ID' });
      return;
    }

    // Check if director exists
    const existing = await query('SELECT * FROM Directors WHERE director_id = ?', [directorId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { director_name } = req.body;

    if (!director_name) {
      res.status(400).json({ error: 'Director name is required' });
      return;
    }

    const sql = 'UPDATE Directors SET director_name = ? WHERE director_id = ?';
    await run(sql, [director_name, directorId]);

    const updatedDirector = await query('SELECT * FROM Directors WHERE director_id = ?', [directorId]);

    res.status(200).json(updatedDirector[0]);
  } catch (error) {
    console.error('Error updating director:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /directors/:director_id - Delete a director
export const deleteDirector = async (req: Request, res: Response): Promise<void> => {
  try {
    const directorId = parseInt(req.params.director_id);

    if (isNaN(directorId)) {
      res.status(400).json({ error: 'Invalid director ID' });
      return;
    }

    // Check if director exists
    const existing = await query('SELECT * FROM Directors WHERE director_id = ?', [directorId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Directors WHERE director_id = ?';
    await run(sql, [directorId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting director:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};