import { inject, injectable } from "tsyringe";

import { ConflictError } from "@core/errors/ConflictError";
import type { UseCase } from "@core/UseCase";
import type { IHash } from "@services/hash/IHash";

import type { CreateUserDto } from "../dtos/createUser.dto";
import { User, type UserData } from "../entities/User";
import type { IUsersRepository } from "../repositories/IUsersRepository";

type Request = CreateUserDto;

type Response = UserData;

@injectable()
export class CreateUserUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("Hash") private readonly hashService: IHash
  ) {}

  async execute({ email, username, password }: Request): Promise<Response> {
    const entity = new User({ email, username, password });

    const emailAlreadyRegistered = await this.usersRepository.findOne({
      email: entity.email,
    });

    if (emailAlreadyRegistered)
      throw new ConflictError("email already registered");

    const usernameAlreadyRegistered = await this.usersRepository.findOne({
      username: entity.username,
    });

    if (usernameAlreadyRegistered)
      throw new ConflictError("username already registered");

    const passwordHash = await this.hashService.hash(entity.password);

    const user = await this.usersRepository.create({
      id: entity.id,
      username: entity.username,
      email: entity.email,
      password: passwordHash,
      verified: entity.verified,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return user;
  }
}
