import os from "node:os";

export const healthService = async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV|| "development",
    hostname: os.hostname(),
    nodeVersion: process.version,
    memory: process.memoryUsage(),
  };
};