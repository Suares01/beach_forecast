import "reflect-metadata";
import "@core/containers/index";

import logger from "@core/loggers/winston/logger";

import { Server } from "./http/express/Server";

const server = new Server();

const exitSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];

(async () => {
  try {
    await server.start();
    process.send && process.send("ready");

    exitSignals.forEach((signal) =>
      process.on(signal, async () => {
        try {
          await server.close();
          logger.info(`Process (${process.pid}) exited with success`);
          process.exit(0);
        } catch (error) {
          logger.error(`Process (${process.pid}) exited with error: ${error}`);
          process.exit(1);
        }
      })
    );
  } catch (error) {
    logger.error(`Process (${process.pid}) exited with error: ${error}`);
    process.exit(1);
  }
})();
