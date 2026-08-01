import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import {
  createUser,
  loginUser,
  logoutService,
  refreshTokenService,
} from "../services/auth.services";
import { ENV } from "../config/env";
import { decodeToken, generateAuthToken } from "../utils/jwt";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/app-errors";

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

  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
      token: user.accessToken,
    },
  });
};

export const logoutController = async (req: Request, res: Response) => {
  await logoutService({
    userId: req.user?.id!,
  });

  return res.status(204).send();
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;


  const data = await refreshTokenService({refreshToken});
  console.log(data,"data");
  

  res.cookie("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: { accessToken: data.accessToken },
  });
};
