import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';




export const createAuthRouter = (authController: AuthController): Router => {
    const router = Router();
    router.get('/login', authController.login);
    router.get('/callback', authController.callback);
    router.post('/refresh', authController.refresh);
    router.post('/logout', authController.logout);
    return router;
}