import express, { Application } from 'express';
import cors from 'cors';
import { PORT, FRONTEND_URL } from './config';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import https from 'https';
import fs from 'fs';

const app: Application = express();

const port = Number(PORT) || 4505;

app.use(cors({
    origin: FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on https://localhost:${port}`);
});
