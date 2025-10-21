import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, 'SQL Scripts', 'movies.db');
const sqlite3Verbose = sqlite3.verbose();
const db = new sqlite3Verbose.Database(dbFile);

// Type definitions
interface CountResult {
    count: number;
}

interface Movie {
    movie_id: number;
    title: string;
    release_date: string;
    runtime_in_minutes: number;
    budget: number | null;
    revenue: number | null;
    mpa_rating: string | null;
}

interface Genre {
    genre_name: string;
}

interface CastMember {
    actor_name: string;
    character_name: string;
}

console.log('\n========================================');
console.log('  DATABASE VERIFICATION TEST');
console.log('========================================\n');

// Test 1: Count Movies
db.get("SELECT COUNT(*) as count FROM Movies", (err: Error | null, row: CountResult) => {
    if (err) {
        console.error('Error counting movies:', err);
        return;
    }
    console.log(`✓ Total Movies: ${row.count}`);
    
    // Test 2: Count Genres
    db.get("SELECT COUNT(*) as count FROM Genres", (err: Error | null, row: CountResult) => {
        if (err) {
            console.error('Error counting genres:', err);
            return;
        }
        console.log(`✓ Total Genres: ${row.count}`);
        
        // Test 3: Count Actors
        db.get("SELECT COUNT(*) as count FROM Actors", (err: Error | null, row: CountResult) => {
            if (err) {
                console.error('Error counting actors:', err);
                return;
            }
            console.log(`✓ Total Actors: ${row.count}`);
            
            // Test 4: Count Directors
            db.get("SELECT COUNT(*) as count FROM Directors", (err: Error | null, row: CountResult) => {
                if (err) {
                    console.error('Error counting directors:', err);
                    return;
                }
                console.log(`✓ Total Directors: ${row.count}`);
                
                // Test 5: Count Studios
                db.get("SELECT COUNT(*) as count FROM Studios", (err: Error | null, row: CountResult) => {
                    if (err) {
                        console.error('Error counting studios:', err);
                        return;
                    }
                    console.log(`✓ Total Studios: ${row.count}`);
                    
                    // Test 6: Count Producers
                    db.get("SELECT COUNT(*) as count FROM Producers", (err: Error | null, row: CountResult) => {
                        if (err) {
                            console.error('Error counting producers:', err);
                            return;
                        }
                        console.log(`✓ Total Producers: ${row.count}\n`);
                        
                        // Test 7: Show random movie with details
                        db.get(`
                            SELECT m.movie_id, m.title, m.release_date, m.runtime_in_minutes, 
                                m.budget, m.revenue, m.mpa_rating
                            FROM Movies m
                            ORDER BY RANDOM()
                            LIMIT 1
                        `, (err: Error | null, movie: Movie) => {
                            if (err) {
                                console.error('Error fetching random movie:', err);
                                return;
                            }
                            console.log('========================================');
                            console.log('  SAMPLE MOVIE');
                            console.log('========================================');
                            console.log(`Title: ${movie.title}`);
                            console.log(`Release Date: ${movie.release_date}`);
                            console.log(`Runtime: ${movie.runtime_in_minutes} minutes`);
                            console.log(`Budget: $${movie.budget?.toLocaleString() || 'N/A'}`);
                            console.log(`Revenue: $${movie.revenue?.toLocaleString() || 'N/A'}`);
                            console.log(`Rating: ${movie.mpa_rating || 'N/A'}\n`);
                            
                            // Test 8: Show genres for this random movie
                            db.all(`
                                SELECT g.genre_name
                                FROM Movie_Genres mg
                                JOIN Genres g ON mg.genre_id = g.genre_id
                                WHERE mg.movie_id = ?
                            `, [movie.movie_id], (err: Error | null, genres: Genre[]) => {
                                if (err) {
                                    console.error('Error fetching genres:', err);
                                    return;
                                }
                                console.log(`Genres: ${genres.map(g => g.genre_name).join(', ')}\n`);
                                
                                // Test 9: Show cast for this random movie
                                db.all(`
                                    SELECT a.actor_name, c.character_name
                                    FROM Cast c
                                    JOIN Actors a ON c.actor_id = a.actor_id
                                    WHERE c.movie_id = ?
                                    LIMIT 5
                                `, [movie.movie_id], (err: Error | null, cast: CastMember[]) => {
                                    if (err) {
                                        console.error('Error fetching cast:', err);
                                        return;
                                    }
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