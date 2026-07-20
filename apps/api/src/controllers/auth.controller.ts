import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";

export const signUpController = asyncHandler((req: Request, res: Response) => {
  const data = req.body;

  return res.json(data);
});
