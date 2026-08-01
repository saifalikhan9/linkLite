import { Router } from "express";

import {
  loginController,
  registerController,
  refreshTokenController,
  logoutController,
} from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validateSchema";
import { authSchema } from "../schema/auth.schema";
import { asyncHandler } from "../middlewares/async-handler";

const router = Router();

router.post("/register", validateSchema(authSchema), registerController);
router.post("/login", validateSchema(authSchema), loginController);
router.post("/logout", logoutController);
router.post("/refreshToken", asyncHandler(refreshTokenController));

export default router;
