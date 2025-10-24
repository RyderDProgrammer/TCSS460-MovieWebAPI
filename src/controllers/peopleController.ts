import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// GET /people - List all people
export const getAllPeople = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM people ORDER BY name';
    const people = await query(sql, []);

    res.status(200).json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /people/:person_id - Get person by ID
export const getPersonById = async (req: Request, res: Response): Promise<void> => {
  try {
    const personId = parseInt(req.params.person_id);

    if (isNaN(personId)) {
      res.status(400).json({ error: 'Invalid person ID' });
      return;
    }

    const sql = 'SELECT * FROM people WHERE person_id = ?';
    const people = await query(sql, [personId]);

    if (people.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(people[0]);
  } catch (error) {
    console.error('Error fetching person:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /people - Create a new person
export const createPerson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, profile_url } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const sql = 'INSERT INTO people (name, profile_url) VALUES (?, ?)';
    const result = await run(sql, [name, profile_url || null]);

    const newPerson = await query('SELECT * FROM people WHERE person_id = ?', [result.lastID]);

    res.status(201).json(newPerson[0]);
  } catch (error) {
    console.error('Error creating person:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /people/:person_id - Update a person
export const updatePerson = async (req: Request, res: Response): Promise<void> => {
  try {
    const personId = parseInt(req.params.person_id);

    if (isNaN(personId)) {
      res.status(400).json({ error: 'Invalid person ID' });
      return;
    }

    // Check if person exists
    const existing = await query('SELECT * FROM people WHERE person_id = ?', [personId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { name, profile_url } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const sql = 'UPDATE people SET name = ?, profile_url = ? WHERE person_id = ?';
    await run(sql, [name, profile_url || null, personId]);

    const updatedPerson = await query('SELECT * FROM people WHERE person_id = ?', [personId]);

    res.status(200).json(updatedPerson[0]);
  } catch (error) {
    console.error('Error updating person:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /people/:person_id - Delete a person
export const deletePerson = async (req: Request, res: Response): Promise<void> => {
  try {
    const personId = parseInt(req.params.person_id);

    if (isNaN(personId)) {
      res.status(400).json({ error: 'Invalid person ID' });
      return;
    }

    // Check if person exists
    const existing = await query('SELECT * FROM people WHERE person_id = ?', [personId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM people WHERE person_id = ?';
    await run(sql, [personId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};