import knex from "knex";
import dotenv from "dotenv";
dotenv.config();
let hasChecked = false;

class Database {
    static instance;

    static getInstance() {
        if (!Database.instance) {
            // Validate required environment variables
            const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
            const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

            if (missingVars.length > 0) {
                console.warn(`Missing environment variables: ${missingVars.join(', ')}. Using defaults.`);
            }

            Database.instance = knex({
                client: 'pg',
                connection: {
                    host: process.env.DB_HOST || 'localhost',
                    port: Number(process.env.DB_PORT) || 5432,
                    user: process.env.DB_USER || 'postgres',
                    password: process.env.DB_PASSWORD || '',
                    database: process.env.DB_NAME || 'messaginghub',
                    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
                },
                pool: {
                    min: 2,
                    max: 10,
                    acquireTimeoutMillis: 60000,
                    createTimeoutMillis: 30000,
                    destroyTimeoutMillis: 5000,
                    idleTimeoutMillis: 30000,
                    reapIntervalMillis: 1000,
                    createRetryIntervalMillis: 200,
                },
                acquireConnectionTimeout: 60000,
            });
        }
        return Database.instance;
    }
}

const db = Database.getInstance();

const checkDbConnection = async () => {
    if (hasChecked) return;
    hasChecked = true;

    try {
        await db.raw('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        console.error('Please check your database configuration and environment variables');
        process.exit(1);
    }
}

export { db, checkDbConnection };