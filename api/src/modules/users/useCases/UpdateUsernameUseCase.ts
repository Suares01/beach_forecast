import { inject, injectable } from "tsyringe";

import { ConflictError } from "@core/errors/ConflictError";
import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";

import type { UpdateUsernameDto } from "../dtos/updateUsername.dto";
import { User, type UserData } from "../entities/User";
import type { IUsersRepository } from "../repositories/IUsersRepository";

type Request = UpdateUsernameDto;

type Response = UserData;

@injectable()
export class UpdateUsernameUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({ id, newUsername }: Request): Promise<Response> {
    User.validateUsername(newUsername);

    const usernameAlreadyRegistered = await this.usersRepository.findOne({
      username: newUsername,
    });

    if (usernameAlreadyRegistered)
      throw new ConflictError("username already registered");

    const user = await this.usersRepository.findOne({ id });

    if (!user) throw new NotFoundError("user not found");

    const updatedUser = await this.usersRepository.updateUsername(
      id,
      newUsername
    );

    return updatedUser;
  }
}
