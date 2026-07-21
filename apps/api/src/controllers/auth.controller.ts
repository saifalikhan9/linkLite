import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import { createUser, loginUser } from "../services/auth.services";
import { success } from "zod";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await createUser({ ...req.body });

    return res.status(201).json({
      success: true,
      data: user,
    });
  },
);

export const loginController = async (req: Request, res: Response) => {
  const user = await loginUser({ ...req.body });

  return res.status(200).json({
    success: true,
    data: user,
  });
};
