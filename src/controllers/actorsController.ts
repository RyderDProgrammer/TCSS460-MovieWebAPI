import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// GET /actors - List all actors
export const getAllActors = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM Actors ORDER BY actor_name';
    const actors = await query(sql, []);

    res.status(200).json(actors);
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /actors/:actor_name - Get actor by name (fuzzy search)
export const getActorByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorName = req.params.actor_name;

    if (!actorName) {
      res.status(400).json({ error: 'Invalid actor name' });
      return;
    }

    const sql = 'SELECT * FROM Actors WHERE LOWER(actor_name) LIKE LOWER(?)';
    const actors = await query(sql, [`%${actorName}%`]);

    if (actors.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(actors);
  } catch (error) {
    console.error('Error fetching actor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /actors/:actor_id/movies - Get all movies for an actor
export const getActorMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorId = parseInt(req.params.actor_id);

    if (isNaN(actorId)) {
      res.status(400).json({ error: 'Invalid actor ID' });
      return;
    }

    const sql = `
      SELECT m.*, c.character_name
      FROM Movies m
      INNER JOIN Cast c ON m.movie_id = c.movie_id
      WHERE c.actor_id = ?
      ORDER BY m.release_date DESC
    `;
    const movies = await query(sql, [actorId]);

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching actor movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /actors - Create a new actor
export const createActor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, profile_url } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Actor name is required' });
      return;
    }

    const sql = 'INSERT INTO Actors (actor_name, profile_url) VALUES (?, ?)';
    const result = await run(sql, [name, profile_url || null]);

    const newActor = await query('SELECT * FROM Actors WHERE actor_id = ?', [result.lastID]);

    res.status(201).json(newActor[0]);
  } catch (error) {
    console.error('Error creating actor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /actors/:actor_id - Update an actor
export const updateActor = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorId = parseInt(req.params.actor_id);

    if (isNaN(actorId)) {
      res.status(400).json({ error: 'Invalid actor ID' });
      return;
    }

    // Check if actor exists
    const existing = await query('SELECT * FROM Actors WHERE actor_id = ?', [actorId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { name, profile_url } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Actor name is required' });
      return;
    }

    const sql = 'UPDATE Actors SET actor_name = ?, profile_url = ? WHERE actor_id = ?';
    await run(sql, [name, profile_url || null, actorId]);

    const updatedActor = await query('SELECT * FROM Actors WHERE actor_id = ?', [actorId]);

    res.status(200).json(updatedActor[0]);
  } catch (error) {
    console.error('Error updating actor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /actors/:actor_id - Delete an actor
export const deleteActor = async (req: Request, res: Response): Promise<void> => {
  try {
    const actorId = parseInt(req.params.actor_id);

    if (isNaN(actorId)) {
      res.status(400).json({ error: 'Invalid actor ID' });
      return;
    }

    // Check if actor exists
    const existing = await query('SELECT * FROM Actors WHERE actor_id = ?', [actorId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Actors WHERE actor_id = ?';
    await run(sql, [actorId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting actor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};