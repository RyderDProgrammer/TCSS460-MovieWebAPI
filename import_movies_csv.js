const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function importMoviesCSV(csvFile, dbFile) {
    const db = new sqlite3.Database(dbFile);
    
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON");
    
    // OPTIMIZATION: Enable performance pragmas
    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA synchronous = NORMAL");
    db.run("PRAGMA cache_size = 10000");
    db.run("PRAGMA temp_store = MEMORY");
    
    // Promisify database operations
    const dbRun = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    };
    
    const dbGet = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    };
    
    const dbAll = (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };
    
    // OPTIMIZATION: Pre-load all lookup tables into memory
    console.log('Loading existing data into cache...');
    const genreCache = {};
    const studioCache = {};
    const producerCache = {};
    const directorCache = {};
    const actorCache = {};
    
    const genres = await dbAll("SELECT genre_id, genre_name FROM Genres");
    genres.forEach(g => genreCache[g.genre_name] = g.genre_id);
    
    const studios = await dbAll("SELECT studio_id, studio_name FROM Studios");
    studios.forEach(s => studioCache[s.studio_name] = s.studio_id);
    
    const producers = await dbAll("SELECT producer_id, producer_name FROM Producers");
    producers.forEach(p => producerCache[p.producer_name] = p.producer_id);
    
    const directors = await dbAll("SELECT director_id, director_name FROM Directors");
    directors.forEach(d => directorCache[d.director_name] = d.director_id);
    
    const actors = await dbAll("SELECT actor_id, actor_name FROM Actors");
    actors.forEach(a => actorCache[a.actor_name] = a.actor_id);
    
    console.log('Cache loaded successfully!\n');
    
    // Helper function to get or create genre
    async function getOrCreateGenre(genreName) {
        if (genreCache[genreName]) {
            return genreCache[genreName];
        }
        const id = await dbRun("INSERT INTO Genres (genre_name) VALUES (?)", [genreName]);
        genreCache[genreName] = id;
        return id;
    }
    
    // Helper function to get or create studio
    async function getOrCreateStudio(studioName, logo, country) {
        if (studioCache[studioName]) {
            return studioCache[studioName];
        }
        const id = await dbRun("INSERT INTO Studios (studio_name, studio_logo, studio_country) VALUES (?, ?, ?)", 
                              [studioName, logo, country]);
        studioCache[studioName] = id;
        return id;
    }
    
    // Helper function to get or create producer
    async function getOrCreateProducer(producerName) {
        if (producerCache[producerName]) {
            return producerCache[producerName];
        }
        const id = await dbRun("INSERT INTO Producers (producer_name) VALUES (?)", [producerName]);
        producerCache[producerName] = id;
        return id;
    }
    
    // Helper function to get or create director
    async function getOrCreateDirector(directorName) {
        if (directorCache[directorName]) {
            return directorCache[directorName];
        }
        const id = await dbRun("INSERT INTO Directors (director_name) VALUES (?)", [directorName]);
        directorCache[directorName] = id;
        return id;
    }
    
    // Helper function to get or create actor
    async function getOrCreateActor(actorName, profile) {
        if (actorCache[actorName]) {
            return actorCache[actorName];
        }
        const id = await dbRun("INSERT INTO Actors (actor_name, profile_url) VALUES (?, ?)", 
                              [actorName, profile]);
        actorCache[actorName] = id;
        return id;
    }
    
    const rows = [];
    
    // Read CSV file
    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (row) => rows.push(row))
            .on('end', resolve)
            .on('error', reject);
    });
    
    console.log(`Found ${rows.length} movies to import\n`);
    
    const startTime = Date.now();
    let processedCount = 0;
    
    // OPTIMIZATION: Process in batches with transactions
    const BATCH_SIZE = 100;
    
    for (let batchStart = 0; batchStart < rows.length; batchStart += BATCH_SIZE) {
        // Start transaction for this batch
        await dbRun("BEGIN TRANSACTION");
        
        const batchEnd = Math.min(batchStart + BATCH_SIZE, rows.length);
        
        for (let i = batchStart; i < batchEnd; i++) {
            const row = rows[i];
            
            try {
                // 1. Insert Movie
                const movieId = await dbRun(`
                    INSERT INTO Movies (title, original_title, release_date, runtime_in_minutes, 
                                       overview, budget, revenue, mpa_rating, collection, 
                                       poster_url, backdrop_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    row['Title'],
                    row['Original Title'],
                    row['Release Date'] || null,
                    row['Runtime (min)'] ? parseInt(row['Runtime (min)']) : null,
                    row['Overview'],
                    row['Budget'] ? parseInt(parseFloat(row['Budget'])) : null,
                    row['Revenue'] ? parseInt(parseFloat(row['Revenue'])) : null,
                    row['MPA Rating'],
                    row['Collection'] || null,
                    row['Poster URL'],
                    row['Backdrop URL']
                ]);
                
                // 2. Process Genres
                if (row['Genres']) {
                    const genres = row['Genres'].split(';')
                        .map(g => g.trim())
                        .filter(g => g);
                    
                    for (const genreName of genres) {
                        const genreId = await getOrCreateGenre(genreName);
                        await dbRun("INSERT OR IGNORE INTO Movie_Genres (movie_id, genre_id) VALUES (?, ?)", 
                                  [movieId, genreId]);
                    }
                }
                
                // 3. Process Studios
                if (row['Studios']) {
                    const studios = row['Studios'].split(';').map(s => s.trim()).filter(s => s);
                    const logos = row['Studio Logos'] ? row['Studio Logos'].split(';').map(l => l.trim()) : [];
                    const countries = row['Studio Countries'] ? row['Studio Countries'].split(';').map(c => c.trim()) : [];
                    
                    for (let j = 0; j < studios.length; j++) {
                        const studioName = studios[j];
                        const logo = logos[j] || null;
                        const country = countries[j] || null;
                        
                        const studioId = await getOrCreateStudio(studioName, logo, country);
                        await dbRun("INSERT OR IGNORE INTO Movie_Studios (movie_id, studio_id) VALUES (?, ?)", 
                                  [movieId, studioId]);
                    }
                }
                
                // 4. Process Producers
                if (row['Producers']) {
                    const producers = row['Producers'].split(';').map(p => p.trim()).filter(p => p);
                    
                    for (const producerName of producers) {
                        const producerId = await getOrCreateProducer(producerName);
                        await dbRun("INSERT OR IGNORE INTO Movie_Producers (movie_id, producer_id) VALUES (?, ?)", 
                                  [movieId, producerId]);
                    }
                }
                
                // 5. Process Directors
                if (row['Directors']) {
                    const directors = row['Directors'].split(';').map(d => d.trim()).filter(d => d);
                    
                    for (const directorName of directors) {
                        const directorId = await getOrCreateDirector(directorName);
                        await dbRun("INSERT OR IGNORE INTO Movie_Directors (movie_id, director_id) VALUES (?, ?)", 
                                  [movieId, directorId]);
                    }
                }
                
                // 6. Process Actors
                for (let j = 1; j <= 10; j++) {
                    const actorName = (row[`Actor ${j} Name`] || '').trim();
                    if (!actorName) continue;
                    
                    const character = row[`Actor ${j} Character`] || '';
                    const profile = row[`Actor ${j} Profile`] || '';
                    
                    const actorId = await getOrCreateActor(actorName, profile);
                    await dbRun(`INSERT OR IGNORE INTO Cast 
                               (movie_id, actor_id, character_name) 
                               VALUES (?, ?, ?)`, 
                              [movieId, actorId, character]);
                }
                
                processedCount++;
                
            } catch (err) {
                console.error(`Error on row ${i + 1} (Title: ${row['Title'] || 'Unknown'}):`, err.message);
                continue;
            }
        }
        
        // Commit transaction for this batch
        await dbRun("COMMIT");
        
        // Progress update
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = processedCount / elapsed;
        const remaining = (rows.length - processedCount) / rate;
        
        console.log(`Processed ${processedCount}/${rows.length} movies... ` +
                   `(${rate.toFixed(1)} movies/sec, ~${Math.ceil(remaining / 60)} min remaining)`);
    }
    
    db.close();
    
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`\nImport complete! Total movies processed: ${processedCount}`);
    console.log(`Total time: ${Math.floor(totalTime / 60)} minutes ${Math.floor(totalTime % 60)} seconds`);
    console.log(`Average speed: ${(processedCount / totalTime).toFixed(1)} movies/second`);
}

// Usage
const csvFile = path.join('project_files', 'movies_last30years.csv');
const dbFile = path.join('SQL Scripts', 'movies.db');

importMoviesCSV(csvFile, dbFile)
    .then(() => console.log('\nDone!'))
    .catch(err => console.error('Fatal error:', err));