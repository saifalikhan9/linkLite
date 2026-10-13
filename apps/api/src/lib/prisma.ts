import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { env } from "../config/env";
import { logger } from "../bootstrap/logger";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const MAX_ATTEMPTS = 5;
const INITIAL_DELAY_MS = 4_000;
const MAX_DELAY_MS = 20_000;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function connectDatabase(): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      logger.info(`Database connection attempt ${attempt}/${MAX_ATTEMPTS}`);

      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;

      logger.info("Database connected successfully");
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (attempt === MAX_ATTEMPTS) {
        logger.error(
          `Database connection failed after ${MAX_ATTEMPTS} attempts: ${message}`,
        );

        throw error;
      }

      const delay = Math.min(
        INITIAL_DELAY_MS * 2 ** (attempt - 1),
        MAX_DELAY_MS,
      );

      logger.warn(
        `Database connection attempt ${attempt} failed: ${message}. ` +
          `Retrying in ${delay}ms`,
      );

      await sleep(delay);
    }
  }
}
