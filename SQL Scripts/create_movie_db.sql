-- Movie Database Initialization Script
-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS Movie_Producers;
DROP TABLE IF EXISTS Movie_Directors;
DROP TABLE IF EXISTS Movie_Studios;
DROP TABLE IF EXISTS Movie_Cast;
DROP TABLE IF EXISTS Movie_Genres;
DROP TABLE IF EXISTS Movies;
DROP TABLE IF EXISTS People;
DROP TABLE IF EXISTS Studios;
DROP TABLE IF EXISTS Genres;
-- =========================
-- Table: Genres
-- =========================
CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- =========================
-- Table: Movies
-- =========================
CREATE TABLE Movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    release_date DATE,
    runtime_min INT,
    overview TEXT,
    budget BIGINT,
    revenue BIGINT,
    mpa_rating VARCHAR(10),
    collection VARCHAR(255),
    poster_url TEXT,
    backdrop_url TEXT
);

-- =========================
-- Table: Studios
-- =========================
CREATE TABLE Studios (
    studio_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    country VARCHAR(100),
    logo_url TEXT
);

-- =========================
-- Table: People
-- =========================
CREATE TABLE People (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    profile_url TEXT
);

-- =========================
-- Junction Table: Movie_Genres
-- =========================
CREATE TABLE Movie_Genres (
    movie_genre_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    genre_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================
-- Junction Table: Movie_Studios
-- =========================
CREATE TABLE Movie_Studios (
    movie_studios_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    studio_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES Studios(studio_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================
-- Junction Table: Movie_Directors
-- =========================
CREATE TABLE Movie_Directors (
    movie_director_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    person_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (person_id) REFERENCES People(person_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================
-- Junction Table: Movie_Producers
-- =========================
CREATE TABLE Movie_Producers (
    movie_producer_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    person_id INT,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (person_id) REFERENCES People(person_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =========================
-- Junction Table: Movie_Cast
-- =========================
CREATE TABLE Movie_Cast (
    uniqueId INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    person_id INT,
    character_name VARCHAR(255),
    cast_order INT,
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (person_id) REFERENCES People(person_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
