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
// Create and export database connection - CHANGED TO READWRITE
export const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, // Changed from OPEN_READONLY
(err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
        process.exit(1);
    }
    else {
        console.log('Connected to SQLite DB at', DB_PATH);
    }
});
/**
 * Execute a SELECT query (returns multiple rows)
 */
export function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows || []);
            }
        });
    });
}
/**
 * Execute INSERT, UPDATE, or DELETE query
 */
export function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}
/**
 * Execute a SELECT query that returns a single row
 */
export function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}
/**
 * Gracefully close database connection
 */
export function closeDatabase() {
    return new Promise((resolve) => {
        db.close(() => {
            console.log('Closed DB connection');
            resolve();
        });
    });
}
//# sourceMappingURL=database.js.map