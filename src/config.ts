import dotenv from 'dotenv';
dotenv.config();

export const {
    PORT,
    AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET,
    AZURE_REDIRECT_URI,
    AZURE_TENANT,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    FRONTEND_URL,
    OUTLOOK_EMAIL,
    OUTLOOK_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env;
