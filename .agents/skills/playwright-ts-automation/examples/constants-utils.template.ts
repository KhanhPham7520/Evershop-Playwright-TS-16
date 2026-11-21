import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables based on TEST_ENV flag
const environment = process.env.TEST_ENV || 'local';
dotenv.config({ path: path.resolve(process.cwd(), `env/.env.${environment}`) });
dotenv.config({ path: path.resolve(process.cwd(), 'env/.env') });

export const HOST = process.env.HOST || 'http://localhost';
export const PORT = process.env.PORT || '3000';
export const APP_URL = `${HOST}:${PORT}`;
export const API_URL = `${HOST}:${PORT}`;

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@example.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';
