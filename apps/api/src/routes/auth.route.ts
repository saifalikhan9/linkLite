import { Router } from "express";

import {
  loginController,
  registerController,
  
  refreshToken,
  logoutController,
} from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validateSchema";
import { authSchema } from "../schema/auth.schema";

const router = Router();

router.post("/register", validateSchema(authSchema), registerController);
router.post("/login", validateSchema(authSchema), loginController);
router.post("/logout", logoutController);
router.post("/refreshToken", refreshToken);

export default router;
