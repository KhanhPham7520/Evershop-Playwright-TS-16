export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const ADMIN_HOST = `${HOST}:${PORT}/admin/login`;
export const URL = `${ADMIN_HOST}`;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const API_URL = `${HOST}:${PORT}`
