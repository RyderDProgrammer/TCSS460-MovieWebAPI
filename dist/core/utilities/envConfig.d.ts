import { Request, Response, NextFunction } from 'express';
/**
 * Environment configuration
 */
export declare const config: {
    port: number;
    host: string;
    nodeEnv: string;
};
/**
 * Middleware to validate API key from X-API-Key header
 */
export declare const validateApiKey: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=envConfig.d.ts.map