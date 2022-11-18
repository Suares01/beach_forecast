import { inject, injectable } from "tsyringe";

import { NotFoundError } from "@core/errors/NotFoundError";
import { UnauthorizedError } from "@core/errors/UnauthorizedError";
import type { UseCase } from "@core/UseCase";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IJsonWebToken } from "@services/JsonWebToken/IJsonWebToken";

type Request = { refreshToken: string };

type Response = { accessToken: string };

@injectable()
export class RefreshTokenUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("JsonWebToken") private readonly jsonWebTokenService: IJsonWebToken,
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({ refreshToken }: Request): Promise<Response> {
    let sub: string;

    try {
      const { sub: verifySub } =
        this.jsonWebTokenService.refreshToken.verify(refreshToken);
      sub = verifySub;
    } catch (error: any) {
      throw new UnauthorizedError(error.message);
    }

    const user = await this.usersRepository.findOne({ id: sub });

    if (!user) throw new NotFoundError("user not found");

    const { id, email, username } = user;
    const accessToken = this.jsonWebTokenService.accessToken.sign({
      email,
      username,
      sub: id,
    });

    return { accessToken };
  }
}
