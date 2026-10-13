import { customAlphabet } from "nanoid";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/app-errors";
import { generateGuestToken } from "../utils/generateGuestToken";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const generateShortCode =   customAlphabet(alphabet, 6);

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

export const guestUrlShortnerService = async ({
  originalUrl,
  guestToken,
}: {
  originalUrl: string;
  guestToken?: string;
}) => {
  const shortCode = generateShortCode();

  if (!guestToken) {
    const newGuestToken = generateGuestToken();

    const guest = await prisma.guest.create({
      data: {
        guestToken: newGuestToken,
      },
    });

    const url = await prisma.url.create({
      data: {
        guestId: guest.id,
        originalUrl,
        shortCode,
      },
    });

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      guestToken: newGuestToken,
    };
  } else {
    let guest = await prisma.guest.findUnique({
      where: {
        guestToken,
      },
    });

    let currentGuestToken = guestToken;
    if (!guest) {
      currentGuestToken = generateGuestToken();
      guest = await prisma.guest.create({
        data: {
          guestToken: currentGuestToken,
        },
      });
    }

    const url = await prisma.url.create({
      data: {
        guestId: guest.id,
        originalUrl,
        shortCode,
      },
    });

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      guestToken: currentGuestToken,
    };
  }
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
