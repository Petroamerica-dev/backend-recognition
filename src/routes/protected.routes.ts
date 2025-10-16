import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getProfile, getValues, getAllUsers, searchUser, postRecognition, sendEmail } from '../controllers/protected.controller';

const router = Router();

router.use(authMiddleware);

router.get('/users/:userId', getProfile);
router.get('/values', getValues);
router.get('/users', getAllUsers);
router.get('/search-user', searchUser);
router.post('/recognition', postRecognition);
router.post('/send-email', sendEmail);

export default router;