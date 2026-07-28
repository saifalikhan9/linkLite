import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { redirectUrlController } from "../controllers/url.controller";

const router = Router();

router.get("/:shortCode", asyncHandler(redirectUrlController));

export default router;
