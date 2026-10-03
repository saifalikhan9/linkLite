import os from "node:os";
import { prisma } from "../utils/prisma";

export const healthService = async () => {
  let database: "up" | "down" = "up";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "down";
  }

  return {
    status: database === "up" ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    hostname: os.hostname(),
    nodeVersion: process.version,
    memory: process.memoryUsage(),
    database,
  };
};