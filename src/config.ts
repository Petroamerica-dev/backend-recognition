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
    OUTLOOK_PASSWORD
} = process.env;
