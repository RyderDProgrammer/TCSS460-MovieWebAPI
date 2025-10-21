import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, 'SQL Scripts', 'movies.db');  // Database goes in SQL Scripts
const sqlFile = path.join(__dirname, 'SQL Scripts', 'create_movie_db.sql');

// Delete old database if it exists
if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('Deleted old database');
}

// Create new database with verbose mode
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database(dbFile);

// Read and execute SQL schema
const schema = fs.readFileSync(sqlFile, 'utf8');

db.exec(schema, (err: Error | null) => {
    if (err) {
        console.error('Error creating schema:', err);
        process.exit(1);
    } else {
        console.log('Database created successfully at:', dbFile);
    }
    db.close((closeErr: Error | null) => {
        if (closeErr) {
            console.error('Error closing database:', closeErr);
            process.exit(1);
        }
    });
});