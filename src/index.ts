import express, { Application } from 'express';
import cors from 'cors';
import { PORT, FRONTEND_URL } from './config';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import { pool } from './db';

const app: Application = express();

const port = PORT || 4505;

app.use(cors({
    origin: [FRONTEND_URL || 'http://localhost:5173', 'http://localhost:4173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ time: result.rows[0] });
    } catch (error) {
        console.error('Error al consultar:', error);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
});

app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
