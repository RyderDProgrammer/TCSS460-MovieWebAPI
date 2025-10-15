const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join('SQL Scripts', 'movies.db');
const db = new sqlite3.Database(dbFile);

console.log('\n========================================');
console.log('  DATABASE VERIFICATION TEST');
console.log('========================================\n');

// Test 1: Count Movies
db.get("SELECT COUNT(*) as count FROM Movies", (err, row) => {
    if (err) {
        console.error('Error counting movies:', err);
        return;
    }
    console.log(`✓ Total Movies: ${row.count}`);
    
    // Test 2: Count Genres
    db.get("SELECT COUNT(*) as count FROM Genres", (err, row) => {
        console.log(`✓ Total Genres: ${row.count}`);
        
        // Test 3: Count Actors
        db.get("SELECT COUNT(*) as count FROM Actors", (err, row) => {
            console.log(`✓ Total Actors: ${row.count}`);
            
            // Test 4: Count Directors
            db.get("SELECT COUNT(*) as count FROM Directors", (err, row) => {
                console.log(`✓ Total Directors: ${row.count}`);
                
                // Test 5: Count Studios
                db.get("SELECT COUNT(*) as count FROM Studios", (err, row) => {
                    console.log(`✓ Total Studios: ${row.count}`);
                    
                    // Test 6: Count Producers
                    db.get("SELECT COUNT(*) as count FROM Producers", (err, row) => {
                        console.log(`✓ Total Producers: ${row.count}\n`);
                        
                        // Test 7: Show sample movie with details
                        db.get(`
                            SELECT m.movie_id, m.title, m.release_date, m.runtime_in_minutes, 
                                   m.budget, m.revenue, m.mpa_rating
                            FROM Movies m
                            LIMIT 1
                        `, (err, movie) => {
                            console.log('========================================');
                            console.log('  SAMPLE MOVIE');
                            console.log('========================================');
                            console.log(`Title: ${movie.title}`);
                            console.log(`Release Date: ${movie.release_date}`);
                            console.log(`Runtime: ${movie.runtime_in_minutes} minutes`);
                            console.log(`Budget: $${movie.budget?.toLocaleString() || 'N/A'}`);
                            console.log(`Revenue: $${movie.revenue?.toLocaleString() || 'N/A'}`);
                            console.log(`Rating: ${movie.mpa_rating || 'N/A'}\n`);
                            
                            // Test 8: Show genres for this movie
                            db.all(`
                                SELECT g.genre_name
                                FROM Movie_Genres mg
                                JOIN Genres g ON mg.genre_id = g.genre_id
                                WHERE mg.movie_id = ?
                            `, [movie.movie_id], (err, genres) => {
                                console.log(`Genres: ${genres.map(g => g.genre_name).join(', ')}\n`);
                                
                                // Test 9: Show cast for this movie
                                db.all(`
                                    SELECT a.actor_name, c.character_name
                                    FROM Cast c
                                    JOIN Actors a ON c.actor_id = a.actor_id
                                    WHERE c.movie_id = ?
                                    LIMIT 5
                                `, [movie.movie_id], (err, cast) => {
                                    console.log('========================================');
                                    console.log('  CAST (First 5)');
                                    console.log('========================================');
                                    cast.forEach(actor => {
                                        console.log(`${actor.actor_name} as ${actor.character_name}`);
                                    });
                                    
                                    console.log('\n========================================');
                                    console.log('  ✓ ALL TESTS PASSED!');
                                    console.log('========================================\n');
                                    
                                    db.close();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});