import { NextFunction, Request, Response } from "express";

import { APIError } from "@core/errors/ApiError";
import { InternalError } from "@core/errors/InternalError";
import { Middleware } from "@core/Middleware";

export class InternalErrorHandler implements Middleware {
  use(error: unknown, _: Request, res: Response, next: NextFunction): void {
    if (error instanceof InternalError) {
      const { code, message, description, documentation } = error;

      res.status(code).json(
        APIError.format({
          code,
          message,
          description,
          documentation,
        })
      );
    } else {
      next(error);
    }
  }
}
