import pg from 'pg';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './config';

const { Pool } = pg;

export const pool = new Pool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});


pool.connect()
    .then(() => console.log(' Conectado a PostgreSQL correctamente'))
    .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));