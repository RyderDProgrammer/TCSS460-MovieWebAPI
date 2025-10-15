const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = path.join('SQL Scripts', 'movies.db');  // Database goes in SQL Scripts
const sqlFile = path.join('SQL Scripts', 'create_movie_db.sql');

// Delete old database if it exists
if (fs.existsSync(dbFile)) {
    fs.unlinkSync(dbFile);
    console.log('Deleted old database');
}

// Create new database
const db = new sqlite3.Database(dbFile);

// Read and execute SQL schema
const schema = fs.readFileSync(sqlFile, 'utf8');
db.exec(schema, (err) => {
    if (err) {
        console.error('Error creating schema:', err);
    } else {
        console.log('Database created successfully at:', dbFile);
    }
    db.close();
});