import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to database (adjust based on new structure)
const DB_PATH = path.join(__dirname, '../../../data/movies.db');

// Check if database exists at startup
if (!fs.existsSync(DB_PATH)) {
  console.error(`Database file not found at ${DB_PATH}. If you intended to include the DB in the repo, commit it or run the import on startup.`);
  process.exit(1);
}

// Create and export database connection
export const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite DB at', DB_PATH);
  }
});

/**
 * Gracefully close database connection
 */
export function closeDatabase(): Promise<void> {
  return new Promise((resolve) => {
    db.close(() => {
      console.log('Closed DB connection');
      resolve();
    });
  });
}