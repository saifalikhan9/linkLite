
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { ENV } from "../config/env";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: ENV.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}