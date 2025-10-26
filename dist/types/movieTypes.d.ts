export interface Movie {
    movie_id: number;
    title: string;
    release_date: string;
    runtime_in_minutes: number;
    mpa_rating: string;
    [key: string]: any;
}
export interface Genre {
    genre_name: string;
}
export interface CastMember {
    actor_name: string;
    character_name: string;
}
export interface MovieWithDetails extends Movie {
    genres: string[];
    cast: CastMember[];
}
export interface PaginatedMoviesResponse {
    page: number;
    pageSize: number;
    results: Movie[];
}
export interface MoviesByYearResponse {
    year: string;
    count: number;
    movies: Movie[];
}
//# sourceMappingURL=movieTypes.d.ts.map