import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/async-handler";
import {
  createUser,
  loginUser,
  logoutService,
  refreshTokenService,
} from "../services/auth.services";
import { ENV } from "../config/env";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const { user, tokens } = await createUser({ ...req.body });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: { user, accessToken: tokens.accessToken },
    });
  },
);

export const loginController = async (req: Request, res: Response) => {
  const { user, tokens } = await loginUser({ ...req.body });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  });
};

export const logoutController = async (req: Request, res: Response) => {

  const refeshToken = req.cookies.refreshToken
  await logoutService({
    refeshToken
  });

  res.clearCookie("refeshToken");

  return res.status(201).json({
    success: true,
    message: "Logged out Successfully",
    data: null,
  });
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  const data = await refreshTokenService({ refreshToken });
  // console.log(data, "data");

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
