import { Request, Response } from 'express';
/**
 * GET /movies - Get all movies with pagination and optional title search
 */
export declare const getAllMovies: (req: Request, res: Response) => void;
/**
 * GET /moviesbyyear?year=YYYY - Get all movies released in a specific year
 */
export declare const getMoviesByYear: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
/**
 * GET /movies/:id - Get detailed movie information with genres and cast
 */
export declare const getMovieById: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
/**
 * POST /movies - Create a new movie
 */
export declare const createMovie: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
/**
 * PUT /movies/:id - Update an existing movie
 */
export declare const updateMovie: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
/**
 * DELETE /movies/:id - Delete a movie
 */
export declare const deleteMovie: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=movieController.d.ts.map