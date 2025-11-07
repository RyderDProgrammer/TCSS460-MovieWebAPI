import { Request, Response } from 'express';
import { query, run } from '../core/utilities/database.js';

// GET /studios - List all studios with pagination
export const getAllStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 20, 100);
    const offset = (page - 1) * pageSize;

    const sql = 'SELECT * FROM Studios ORDER BY studio_id LIMIT ? OFFSET ?';
    const studios = await query(sql, [pageSize, offset]);

    res.status(200).json({ page, pageSize, results: studios });
  } catch (error) {
    console.error('Error fetching studios:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /studios/:studio_name - Get studio by name with fuzzy search and pagination
export const getStudioByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const studioName = req.params.studio_name;
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize as string) || 10, 10);
    const offset = (page - 1) * pageSize;

    if (!studioName) {
      res.status(400).json({ error: 'Invalid studio name' });
      return;
    }

    const sql = 'SELECT * FROM Studios WHERE LOWER(studio_name) LIKE LOWER(?) LIMIT ? OFFSET ?';
    const studios = await query(sql, [`%${studioName}%`, pageSize, offset]);

    if (studios.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    res.status(200).json({ page, pageSize, results: studios });
  } catch (error) {
    console.error('Error fetching studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /studios - Create a new studio
export const createStudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studio_name, studio_country, studio_logo } = req.body;

    if (!studio_name) {
      res.status(400).json({ error: 'Studio name is required' });
      return;
    }

    const sql = 'INSERT INTO Studios (studio_name, studio_country, studio_logo) VALUES (?, ?, ?)';
    const result = await run(sql, [studio_name, studio_country || null, studio_logo || null]);

    const newStudio = await query('SELECT * FROM Studios WHERE studio_id = ?', [result.lastID]);

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
    const existing = await query('SELECT * FROM Studios WHERE studio_id = ?', [studioId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const { studio_name, studio_country, studio_logo } = req.body;

    if (!studio_name) {
      res.status(400).json({ error: 'Studio name is required' });
      return;
    }

    const sql = 'UPDATE Studios SET studio_name = ?, studio_country = ?, studio_logo = ? WHERE studio_id = ?';
    await run(sql, [studio_name, studio_country || null, studio_logo || null, studioId]);

    const updatedStudio = await query('SELECT * FROM Studios WHERE studio_id = ?', [studioId]);

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
    const existing = await query('SELECT * FROM Studios WHERE studio_id = ?', [studioId]);
    if (existing.length === 0) {
      res.status(404).json({ message: 'Not found' });
      return;
    }

    const sql = 'DELETE FROM Studios WHERE studio_id = ?';
    await run(sql, [studioId]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting studio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};