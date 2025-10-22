-- Movies Database Schema
-- This creates a normalized relational database with singular primary keys
DROP TABLE IF EXISTS Cast;
DROP TABLE IF EXISTS Movie_Directors;
DROP TABLE IF EXISTS Movie_Producers;
DROP TABLE IF EXISTS Movie_Studios;
DROP TABLE IF EXISTS Movie_Genres;
DROP TABLE IF EXISTS Directors;
DROP TABLE IF EXISTS Producers;
DROP TABLE IF EXISTS Studios;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Actors;
DROP TABLE IF EXISTS Movies;

-- Main Movies table
CREATE TABLE Movies (
    movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    release_date DATE,
    runtime_in_minutes INTEGER,
    overview TEXT,
    budget BIGINT,
    revenue BIGINT,
    mpa_rating VARCHAR(10),
    collection VARCHAR(255),
    poster_url TEXT,
    backdrop_url TEXT
);

-- Genres table
CREATE TABLE Genres (
    genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
    genre_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Movie_Genres (
    movie_genre_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    UNIQUE (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE CASCADE
);

-- Studios table
CREATE TABLE Studios (
    studio_id INTEGER PRIMARY KEY AUTOINCREMENT,
    studio_name VARCHAR(255) NOT NULL UNIQUE,
    studio_logo TEXT,
    studio_country VARCHAR(50)
);

CREATE TABLE Movie_Studios (
    movie_studio_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    studio_id INTEGER NOT NULL,
    UNIQUE (movie_id, studio_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES Studios(studio_id) ON DELETE CASCADE
);

-- Producers table
CREATE TABLE Producers (
    producer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    producer_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Movie_Producers (
    movie_producer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    producer_id INTEGER NOT NULL,
    UNIQUE (movie_id, producer_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (producer_id) REFERENCES Producers(producer_id) ON DELETE CASCADE
);

-- Directors table
CREATE TABLE Directors (
    director_id INTEGER PRIMARY KEY AUTOINCREMENT,
    director_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Movie_Directors (
    movie_director_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    director_id INTEGER NOT NULL,
    UNIQUE (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES Directors(director_id) ON DELETE CASCADE
);

-- Actors table
CREATE TABLE Actors (
    actor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_name VARCHAR(255) NOT NULL UNIQUE,
    profile_url TEXT
);

-- Cast table (links actors to movies with character information)
CREATE TABLE Cast (
    cast_id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    character_name VARCHAR(255),
    UNIQUE (movie_id, actor_id, character_name),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES Actors(actor_id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_movies_title ON Movies(title);
CREATE INDEX idx_movies_release_date ON Movies(release_date);
CREATE INDEX idx_movies_mpa_rating ON Movies(mpa_rating);
CREATE INDEX idx_movie_genres_movie ON Movie_Genres(movie_id);
CREATE INDEX idx_movie_genres_genre ON Movie_Genres(genre_id);
CREATE INDEX idx_movie_studios_movie ON Movie_Studios(movie_id);
CREATE INDEX idx_movie_studios_studio ON Movie_Studios(studio_id);
CREATE INDEX idx_movie_producers_movie ON Movie_Producers(movie_id);
CREATE INDEX idx_movie_producers_producer ON Movie_Producers(producer_id);
CREATE INDEX idx_movie_directors_movie ON Movie_Directors(movie_id);
CREATE INDEX idx_movie_directors_director ON Movie_Directors(director_id);
CREATE INDEX idx_cast_movie ON Cast(movie_id);
CREATE INDEX idx_cast_actor ON Cast(actor_id);
CREATE INDEX idx_actors_name ON Actors(actor_name);
CREATE INDEX idx_directors_name ON Directors(director_name);
CREATE INDEX idx_producers_name ON Producers(producer_name);
CREATE INDEX idx_studios_name ON Studios(studio_name);