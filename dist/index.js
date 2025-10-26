import app from './app.js';
import { config } from './core/utilities/envConfig.js';
import { closeDatabase } from './core/utilities/database.js';
// Start server
const server = app.listen(config.port, config.host, () => {
    console.log(`Server listening on ${config.host}:${config.port}`);
});
// Graceful shutdown
function gracefulShutdown() {
    console.log('Shutting down gracefully...');
    server.close(() => {
        closeDatabase().then(() => {
            process.exit(0);
        });
    });
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
//# sourceMappingURL=index.js.map