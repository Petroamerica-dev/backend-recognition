import { Router } from "express";
import { RecognitionController } from "../controllers/recognition.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { asyncHandler } from "../middlewares/asyncHandler";

export const createRecognitionRouter = (recognitionController: RecognitionController): Router => {
    const router = Router();
    // router.use(authMiddleware);
    router.post('/', asyncHandler(recognitionController.createRecognition))
    router.put('/:id', asyncHandler(recognitionController.updateRecognition))

    return router;
}