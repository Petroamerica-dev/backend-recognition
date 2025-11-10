import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import { FRONTEND_URL, PORT } from './config/env';

import { createUserRouter } from './routes/user.routes';
import { coreValueController, emailController, recognitionController, userController } from './config/instances';
import { createCoreValueRouter } from './routes/core_value.routes';
import { createRecognitionRouter } from './routes/recognition.routes';
import { createEmailRouter } from './routes/email.routes';

export const createApp = (): Application => {
    const app: Application = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors({
        origin: [FRONTEND_URL || 'http://localhost:5173', 'http://localhost:4173'],
        credentials: true
    }));

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: 'Server is running',
            timestamp: new Date().toISOString()
        })
    });

    app.use('/api/users', createUserRouter(userController));
    app.use('/api/core-values', createCoreValueRouter(coreValueController));
    app.use('/api/recognitions', createRecognitionRouter(recognitionController));
    app.use('/api/emails', createEmailRouter(emailController));
    // app.use('/api/auth', authRoutes);

    app.use(errorHandler);
    return app;
}






