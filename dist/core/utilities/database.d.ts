import sqlite3 from 'sqlite3';
export declare const db: sqlite3.Database;
/**
 * Execute a SELECT query (returns multiple rows)
 */
export declare function query(sql: string, params?: any[]): Promise<any[]>;
/**
 * Execute INSERT, UPDATE, or DELETE query
 */
export declare function run(sql: string, params?: any[]): Promise<any>;
/**
 * Execute a SELECT query that returns a single row
 */
export declare function get(sql: string, params?: any[]): Promise<any>;
/**
 * Gracefully close database connection
 */
export declare function closeDatabase(): Promise<void>;
//# sourceMappingURL=database.d.ts.map