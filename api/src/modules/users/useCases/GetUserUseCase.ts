import { inject, injectable } from "tsyringe";

import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";

import type { GetUserDto } from "../dtos/getUser.dto";
import type { UserData } from "../entities/User";
import type { IUsersRepository } from "../repositories/IUsersRepository";

type Request = GetUserDto;

type Response = UserData;

@injectable()
export class GetUserUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({ email, id, username }: Request): Promise<Response> {
    let user: UserData | null = null;

    if (id) {
      user = await this.usersRepository.findOne({ id });
    } else if (email) {
      user = await this.usersRepository.findOne({ email });
    } else if (username) {
      user = await this.usersRepository.findOne({ username });
    }

    if (!user) throw new NotFoundError("User not found");

    return user;
  }
}
