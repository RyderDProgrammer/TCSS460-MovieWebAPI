import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
/**
 * Environment configuration
 */
export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
};
/**
 * API Keys from environment variable
 * Format: API_KEYS=key1,key2,key3
 */
const API_KEYS = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
/**
 * Middleware to validate API key from X-API-Key header
 */
export const validateApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    // Check if API key is present
    if (!apiKey) {
        res.status(401).json({ message: 'Unauthorized - missing API key' });
        return;
    }
    // Check if API key is valid
    if (!API_KEYS.includes(apiKey)) {
        res.status(401).json({ message: 'Unauthorized - invalid API key' });
        return;
    }
    // API key is valid, continue to next middleware/route handler
    next();
};
//# sourceMappingURL=envConfig.js.map