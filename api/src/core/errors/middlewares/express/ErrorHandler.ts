import { NextFunction, Request, Response } from "express";

import { APIError } from "@core/errors/ApiError";
import logger from "@core/loggers/winston/logger";
import { Middleware } from "@core/Middleware";

export class ErrorHandler implements Middleware {
  use(error: unknown, _: Request, res: Response, __: NextFunction): void {
    logger.error(error);
    res.status(500).json(
      APIError.format({
        message: "Something went wrong",
        code: 500,
      })
    );
  }
}
