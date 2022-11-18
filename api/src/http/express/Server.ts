import "express-async-errors";

import compression from "compression";
import config from "config";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import * as http from "http";
import morgan from "morgan";
import { container } from "tsyringe";

import { InternalError } from "@core/errors/InternalError";
import { ErrorHandler } from "@core/errors/middlewares/express/ErrorHandler";
import { InternalErrorHandler } from "@core/errors/middlewares/express/InternalErrorHandler";
import logger from "@core/loggers/winston/logger";
import { ICacheService } from "@services/cacheService/ICacheService";

import * as database from "../../database/prisma";
import { IServer } from "../IServer";
import routes from "./routes";

export class Server implements IServer {
  private readonly app: Express = express();

  private readonly cacheService =
    container.resolve<ICacheService>("CacheService");

  protected readonly server: http.Server = http.createServer(this.app);

  constructor(private readonly port = config.get<number>("App.port")) {}

  public async start(): Promise<void> {
    await this.setupServer();

    this.server.listen(this.port, () =>
      logger.info(
        `Server is running on: \n http://localhost:${this.port} \n http://localhost:${this.port}/docs`
      )
    );
  }

  public async close(): Promise<void> {
    this.server.close((err: any) => {
      if (err) {
        new InternalError("failed to shut down server");
      } else {
        logger.info("Server closed");
      }
    });
    await this.cacheService.disconnect();
    await database.disconnect();
  }

  private async setupServer() {
    this.setupExpress();
    this.setupLoggers();
    this.setupRoutes();
    await this.setupDatabase();
    await this.setupCacheService();
    this.setupErrorHandlers();
  }

  private setupExpress() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  private setupLoggers() {
    this.app.use(
      morgan("combined", {
        stream: {
          write(message: any) {
            logger.info(message);
          },
        },
      })
    );
  }

  private setupRoutes() {
    this.app.use(routes);
  }

  private async setupDatabase() {
    await database.connect();
  }

  private async setupCacheService() {
    await this.cacheService.connect();
  }

  private setupErrorHandlers() {
    const internalErrorHandler = new InternalErrorHandler();
    const errorHandler = new ErrorHandler();

    this.app.use(internalErrorHandler.use);
    this.app.use(errorHandler.use);
  }
}
