import { inject, injectable } from "tsyringe";

import { BadRequestError } from "@core/errors/BadRequestError";
import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import type { IHash } from "@services/hash/IHash";

import type { IUser } from "../entities/User";
import type { IUsersRepository } from "../repositories/IUsersRepository";

type Request = Pick<IUser, "id" | "password">;

type Response = void;

@injectable()
export class DeleteUserUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("Hash") private readonly hashService: IHash,
    @inject("BeachesRepository")
    private readonly beachesRepository: IBeachesRepository
  ) {}

  async execute({ id, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOneWithPassword({ id });

    if (!user) throw new NotFoundError("user not found");

    const validatePassword = await this.hashService.compare(
      password,
      user.password
    );

    if (!validatePassword) throw new BadRequestError("password is incorrect");

    await this.beachesRepository.deleteMany(user.id);

    await this.usersRepository.delete(user.id);
  }
}
