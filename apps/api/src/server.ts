import app from "./app";
import { logger } from "./bootstrap/logger";
import {
  registerGracefulShutdown,
  registerProcessHandlers,
} from "./bootstrap/shutdown";
import { env } from "./config/env";
import { connectDatabase } from "./lib/prisma";

async function startSever() {
  registerProcessHandlers();

  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server listening on port ${env.PORT}`);

      registerGracefulShutdown(server);
    });

    server.on("error", (error) => {
      logger.error("HTTP server error", error);
    });
  } catch (error) {
    logger.error("Application startup failed", error);
    process.exitCode = 1;
  }
}

void startSever();
