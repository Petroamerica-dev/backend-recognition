import pg from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './env';

const { Pool } = pg;

export const pool = new Pool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    max: 20,
    min: 2
});


pool.on('error', (err) => {
    console.error('Error inesperado en el cliente de PostgreSQL', err);
    process.exit(-1);
});

export const testConnection = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        console.log('✅ Conexión exitosa a PostgreSQL');
        client.release();
    } catch (error) {
        console.error('❌ Error al conectar a PostgreSQL:', error);
        throw error;
    }
};