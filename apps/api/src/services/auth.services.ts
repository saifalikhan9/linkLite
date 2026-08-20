import { ENV } from "../config/env";
import { AppError } from "../errors/app-errors";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { decodeToken, generateAuthToken } from "../utils/jwt";
import { prisma } from "../utils/prisma";

export const createUser = async ({
  password,
  email,
}: {
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email.trim(),
      passwordHash,
    },
  });

  const tokens = generateAuthToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });

  return {
    user: { id: user.id, email: user.email },
    tokens,
  };
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValidPassword = await comparePassword(user.passwordHash, password);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = generateAuthToken(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });

  return {
    user: { id: user.id, email: user.email },
    tokens,
  };
};

export const logoutService = async ({
  refeshToken,
}: {
  refeshToken: string;
}) => {
  const user = await prisma.user.findFirst({
    where: {
      refreshToken: refeshToken,
    },
  });

  if (!user) {
    throw new AppError("Invalid Refresh Token", 404);
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: null,
    },
  });

  return;
};

export const refreshTokenService = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  const verifyToken = decodeToken(
    refreshToken,
    ENV.JWT_REFRESH_TOKEN_SECRET_KEY,
  );

  const data = await prisma.user.findUnique({
    where: {
      id: verifyToken.id,
    },
    select: {
      refreshToken: true,
      id: true,
    },
  });
  if (!data) {
    throw new AppError("Failed to get Token data", 404);
  }

  if (data?.refreshToken !== refreshToken) {
    throw new AppError("Invalid Token", 403);
  }

  const tokens = generateAuthToken(data?.id);
  await prisma.user.update({
    where: {
      id: data.id,
    },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });

  return {
    ...tokens,
  };
};
