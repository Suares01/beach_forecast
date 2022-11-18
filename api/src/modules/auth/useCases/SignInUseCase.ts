import { inject, injectable } from "tsyringe";

import { UnauthorizedError } from "@core/errors/UnauthorizedError";
import type { UseCase } from "@core/UseCase";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IHash } from "@services/hash/IHash";
import type { IJsonWebToken } from "@services/JsonWebToken/IJsonWebToken";

import type { SignInDto } from "../dtos/signIn.dto";

type Request = SignInDto;

type Response = {
  accessToken: string;
  refreshToken: string;
};

@injectable()
export class SignInUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("Hash") private readonly hashService: IHash,
    @inject("JsonWebToken") private readonly jsonWebTokenService: IJsonWebToken,
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOneWithPassword({ email });

    if (!user) throw new UnauthorizedError("email or password incorrect");

    const validatePassword = await this.hashService.compare(
      password,
      user.password
    );

    if (!validatePassword)
      throw new UnauthorizedError("email or password incorrect");

    const accessToken = this.jsonWebTokenService.accessToken.sign({
      email,
      username: user.username,
      sub: user.id,
    });

    const refreshToken = this.jsonWebTokenService.refreshToken.sign({
      sub: user.id,
    });

    return { accessToken, refreshToken };
  }
}
