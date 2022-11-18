import { Request, Response } from "express";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";

import { APIError } from "@core/errors/ApiError";
import { ConfigurableMiddleware } from "@core/Middleware";

export class RateLimiter implements ConfigurableMiddleware {
  use(message: string): RateLimitRequestHandler {
    return rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 10,
      keyGenerator(req: Request): string {
        return req.ip;
      },
      handler(_, res: Response): Response {
        return res.status(429).send(
          APIError.format({
            message,
            code: 429,
          })
        );
      },
    });
  }
}
