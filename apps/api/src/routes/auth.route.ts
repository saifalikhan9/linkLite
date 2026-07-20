import { Router } from "express";

import { signUpController } from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validateSchema";
import { createUserSchema } from "../schema/auth.schema";

const router = Router();

router.post("/create", validateSchema(createUserSchema), signUpController);
export default router;
