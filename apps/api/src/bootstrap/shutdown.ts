
import { Server } from "node:http";
import { logger } from "./logger";
import { prisma } from "../lib/prisma";

export const registerProcessHandlers = (): void => {
  process.on("uncaughtException", (error: Error) => {
    logger.error(
      `Uncaught exception: ${error.stack ?? error.message}`,
    );

    process.exit(1);
  });

  process.on("unhandledRejection", (reason: unknown) => {
    const message =
      reason instanceof Error
        ? reason.stack ?? reason.message
        : String(reason);

    logger.error(`Unhandled rejection: ${message}`);

    process.exit(1);
  });
};

export const registerGracefulShutdown = (server: Server): void => {
  let isShuttingDown = false;

  const shutdown = (signal: string): void => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`${signal} received, shutting down gracefully`);

    const timeout = setTimeout(() => {
      logger.error("Graceful shutdown timed out. Forcing exit...");
      process.exit(1);
    }, 10_000);

    server.close(async (serverError) => {
      try {
        if (serverError) {
          throw serverError;
        }

        await prisma.$disconnect();

        logger.info("HTTP server closed and database disconnected");
        clearTimeout(timeout);
        process.exit(0);
      } catch (error) {
        logger.error(
          `Error during shutdown: ${
            error instanceof Error
              ? error.stack ?? error.message
              : String(error)
          }`,
        );

        clearTimeout(timeout);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};
