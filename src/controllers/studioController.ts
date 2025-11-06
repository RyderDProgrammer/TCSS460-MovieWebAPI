import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// GET /studios - List all studios
export const getAllStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const sql = 'SELECT * FROM studios ORDER BY studio_id';
    const studios = await query(sql, []);

    res.status(200).json(studios);
  } catch (error) {
    console.error('Error fetching studios:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /studios/:studio_id - Get studio by ID
export const getStudioById = async (req: Request, res: Response): Promise<void> => {
  try {
    const studioId = parseInt(req.params.studio_id);

    if (isNaN(studioId)) {
      res.status(400).json({ error: 'Invalid studio ID' });
      return;
    }

    const sql = 'SELECT * FROM studios WHERE studio_id = ?';
    const studios = await query(sql, [studioId]);

    if (studios.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json(studios[0]);
  } catch (error) {
    console.error('Error fetching studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /studios - Create a new studio
export const createStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, country, logo_url } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const sql = 'INSERT INTO studios (studio_name, studio_country, studio_logo) VALUES (?, ?, ?)';
    const result = await run(sql, [name, country || null, logo_url || null]);

    const newStudio = await query('SELECT * FROM studios WHERE studio_id = ?', [result.lastID]);

    res.status(201).json(newStudio[0]);
  } catch (error) {
    console.error('Error creating studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /studios/:studio_id - Update a studio
export const updateStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const studioId = parseInt(req.params.studio_id);

    if (isNaN(studioId)) {
      res.status(400).json({ error: 'Invalid studio ID' });
      return;
    }

    // Check if studio exists
    const existing = await query('SELECT * FROM studios WHERE studio_id = ?', [studioId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { name, country, logo_url } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const sql = 'UPDATE studios SET studio_name = ?, studio_country = ?, studio_logo = ? WHERE studio_id = ?';
    await run(sql, [name, country || null, logo_url || null, studioId]);

    const updatedStudio = await query('SELECT * FROM studios WHERE studio_id = ?', [studioId]);

    res.status(200).json(updatedStudio[0]);
  } catch (error) {
    console.error('Error updating studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /studios/:studio_id - Delete a studio
export const deleteStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const studioId = parseInt(req.params.studio_id);

    if (isNaN(studioId)) {
      res.status(400).json({ error: 'Invalid studio ID' });
      return;
    }

    // Check if studio exists
    const existing = await query('SELECT * FROM studios WHERE studio_id = ?', [studioId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM studios WHERE studio_id = ?';
    await run(sql, [studioId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};