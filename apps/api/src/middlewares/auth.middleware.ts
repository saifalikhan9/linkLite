import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-errors";
import { ENV } from "../config/env";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new AppError("Access token is required.", 400);
  }

  const decoded = jwt.verify(
    token,
    ENV.JWT_ACCESS_TOKEN_SECRET_KEY,
  ) as Express.User;
  if (!decoded) {
    throw new Error("Failed to verify the token");
  }

  req.user = decoded;

  next();
};
