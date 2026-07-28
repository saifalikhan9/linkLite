import { customAlphabet } from "nanoid";
import { prisma } from "../utils/prisma";
import { AppError } from "../errors/app-errors";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateShortCode = customAlphabet(alphabet, 6);

export const urlShortnerService = async ({
  originalUrl,
  userId,
}: {
  originalUrl: string;
  userId: string;
}) => {
  const shortCode = generateShortCode();
  // NanoID collisions are extremely unlikely.
  // Retry logic can be added if the application requires higher guarantees.

  const url = await prisma.url.create({
    data: {
      userId,
      originalUrl,
      shortCode,
    },
  });
  return {
    id: url.id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
  };
};

export const redirectUrlService = async ({
  shortCode,
}: {
  shortCode: string;
}) => {
  const url = await prisma.url.findUnique({
    where: {
      shortCode,
    },
  });

  if (!url) {
    throw new AppError("Short URL not found or has expired", 404);
  }

  return url.originalUrl;
};

export const getUserUrlsService = async ({ userId }: { userId: string }) => {
  const urls = await prisma.url.findMany({
    where: {
      userId,
    },
  });
  return urls;
};

export const deleteUrlService = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  const url = await prisma.url.findUnique({
    where: { id },
  });
  if (!url) {
    throw new AppError("Url not found", 404);
  }

  if (userId !== url.userId) {
    throw new AppError("You are not authorized to delete this URL.", 403);
  }

  await prisma.url.delete({
    where: { id },
  });

  return;
};

export const editUrlService = async ({
  originalUrl,
  expiresAt,
  userId,
  id,
}: {
  originalUrl?: string;
  expiresAt?: string;
  userId: string;
  id: string;
}) => {
  const url = await prisma.url.findUnique({
    where: { id },
  });
  if (!url) {
    throw new AppError("Url not found", 404);
  }

  if (userId !== url.userId) {
    throw new AppError("You are not authorized to update this URL.", 403);
  }
  const updatedUrl = await prisma.url.update({
    where: {
      id,
    },
    data: {
      originalUrl,
      
    },
  });
  return {
    originalUrl: updatedUrl.originalUrl,
    updatedAt: updatedUrl.updatedAt,
  };
};
