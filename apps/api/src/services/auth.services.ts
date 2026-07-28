import { AppError } from "../errors/app-errors";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateAuthToken } from "../utils/jwt";
import { prisma } from "../utils/prisma";

export const createUser = async ({
  password,
  email,
}: {
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email,
      passwordHash: passwordHash,
    },
  });
  const token = generateAuthToken(user.id);
  return {
    id: user.id,
    email: user.email,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
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
      email: email.trim().toLowerCase(),
    },
  });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isValidPassword = await comparePassword(user.passwordHash, password);
  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = generateAuthToken(user.id);
  return {
    id: user.id,
    email: user.email,
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
  };
};

export const logoutService = async ({ userId }: { userId: string }) => {
  return true;
};
