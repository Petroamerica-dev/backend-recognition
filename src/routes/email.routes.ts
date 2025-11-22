import { Router } from "express";
import { EmailController } from "../controllers/email.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const createEmailRouter = (emailController: EmailController): Router => {
    const router = Router();
    // router.use(authMiddleware);
    router.post('/', (emailController.sendEmail));
    router.get('/pending', (emailController.getPendingRecognitions));
    return router;
}