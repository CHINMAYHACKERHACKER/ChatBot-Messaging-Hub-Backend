import app from './app.js';
import cluster from 'cluster';
import { availableParallelism } from 'os';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/DataBase.js';

// Load environment variables
dotenv.config({ quiet: true });

const numCPUs = availableParallelism();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Ensure database connection before forking workers
    checkDbConnection()
        .then(() => {
            // Fork workers
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(
                    `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
                );
                console.log('Starting a new worker...');
                cluster.fork();
            });
        })
        .catch((error) => {
            console.error('Failed to connect to database:', error);
            process.exit(1);
        });
} else {
    // Worker process
    const server = app.listen(PORT, () => {
        console.log(`Worker ${process.pid} running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} is already in use`);
            process.exit(1);
        } else {
            console.error('Server error:', error);
        }
    });
}
