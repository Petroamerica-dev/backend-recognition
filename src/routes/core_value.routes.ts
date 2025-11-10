import { Router } from "express";
import { CoreValueController } from "../controllers/core_value.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/auth.middleware";

export const createCoreValueRouter = (coreValueController: CoreValueController): Router => {
    const router = Router();
    router.use(authMiddleware);
    router.get('/', asyncHandler(coreValueController.getAllCoreValues))
    return router;
}