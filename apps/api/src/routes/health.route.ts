import { Router } from "express";
import { healthController } from "../controllers/health.controller";
import { asyncHandler } from "../middlewares/async-handler";

const router = Router();
router.get("/", asyncHandler(healthController));

export default router;
