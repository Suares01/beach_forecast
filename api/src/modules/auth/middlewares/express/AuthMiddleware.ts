import type { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";

import { APIError } from "@core/errors/ApiError";
import type { ConfigurableMiddleware } from "@core/Middleware";
import type { IJsonWebToken } from "@services/JsonWebToken/IJsonWebToken";

export class AuthMiddleware implements ConfigurableMiddleware {
  use(
    jsonWebTokenService: IJsonWebToken = container.resolve("JsonWebToken")
  ): (...params: any) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        res.status(401).json(
          APIError.format({
            message: "jwt is missing",
            code: 401,
          })
        );
        return;
      }

      const token = accessToken.split(" ")[1];

      try {
        const { sub, email, username } =
          jsonWebTokenService.accessToken.verify(token);

        req.user = { id: sub, email, username };

        next();
      } catch (error: any) {
        res.status(401);
        res.json(
          APIError.format({
            message: error.message,
            code: 401,
          })
        );
      }
    };
  }
}
