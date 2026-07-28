import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  shortURL,
  getUserUrlsController,
  editUrlController,
  deleteUrlController,
} from "../controllers/url.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { validateSchema } from "../middlewares/validateSchema";
import { urlSchema } from "../schema/url.schema";

const router = Router();
router.post(
  "/",
  authMiddleware,
  validateSchema(urlSchema),
  asyncHandler(shortURL),
);

router.get("/", authMiddleware, asyncHandler(getUserUrlsController));
router.patch("/:id", authMiddleware, asyncHandler(editUrlController));
router.delete("/:id", authMiddleware, asyncHandler(deleteUrlController));

export default router;
