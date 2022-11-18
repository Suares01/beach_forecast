import { Request, Response } from "express";
import { container } from "tsyringe";

import { APIError } from "@core/errors/ApiError";
import { ForgotPasswordUseCase } from "@modules/auth/useCases/ForgotPasswordUseCase";
import { RefreshTokenUseCase } from "@modules/auth/useCases/RefreshTokenUseCase";
import { ResetPasswordUseCase } from "@modules/auth/useCases/ResetPasswordUseCase";
import { SignInUseCase } from "@modules/auth/useCases/SignInUseCase";

export class ExpressAuthController {
  async signIn(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const signInUseCase = container.resolve(SignInUseCase);

    const tokens = await signInUseCase.execute({ email, password });

    return res.status(200).json(tokens);
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.headers.authorization;

    if (!refreshToken)
      return res.status(401).json(
        APIError.format({
          message: "jwt is missing",
          code: 401,
        })
      );

    const token = refreshToken.split(" ")[1];

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const { accessToken } = await refreshTokenUseCase.execute({
      refreshToken: token,
    });

    return res.status(200).json({ accessToken });
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);

    await forgotPasswordUseCase.execute({ email });

    return res.status(201).send();
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email, newPassword, token } = req.body;

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    await resetPasswordUseCase.execute({ email, newPassword, token });

    return res.status(201).send();
  }
}
