import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database goes in data/ folder (current directory)
const dbFile = path.join(__dirname, 'movies.db');

// SQL schema is in SQL_Scripts subfolder
const sqlFile = path.join(__dirname, 'SQL_Scripts', 'create_movie_db.sql');

console.log('Database path:', dbFile);
console.log('SQL schema path:', sqlFile);

// Check if SQL file exists
if (!fs.existsSync(sqlFile)) {
    console.error(`SQL file not found at: ${sqlFile}`);
    process.exit(1);
}

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
        console.log('✅ Database created successfully at:', dbFile);
        console.log('✅ Schema loaded from:', sqlFile);
    }
    db.close((closeErr: Error | null) => {
        if (closeErr) {
            console.error('Error closing database:', closeErr);
            process.exit(1);
        }
    });
});