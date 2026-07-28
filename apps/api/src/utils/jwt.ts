import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  id: string;
}

export const generateAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ENV.JWT_ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ENV.JWT_REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "7d",
  });
};

export const generateAuthToken = (userId: string) => {
  const accessToken = generateAccessToken({ id: userId });
  const refreshToken = generateRefreshToken({ id: userId });
  return { accessToken, refreshToken };
};

export const decodeToken = (token: string) => {
  jwt.decode(token);
};
