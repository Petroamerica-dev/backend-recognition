import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authMiddleware } from '../middlewares/auth.middleware';


export const createUserRouter = (userController: UserController): Router => {
    const router = Router();
    // router.use(authMiddleware);
    router.get('/', asyncHandler(userController.getAllUsers));
    router.get('/find-id/:id', asyncHandler(userController.getUserById));
    router.get('/find-email/:email', asyncHandler(userController.getUserByEmail));
    router.get('/search', asyncHandler(userController.searchUsers));
    return router;
}