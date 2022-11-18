import { inject, injectable } from "tsyringe";

import { BadRequestError } from "@core/errors/BadRequestError";
import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";
import type { IHash } from "@services/hash/IHash";

import type { UpdatePasswordDto } from "../dtos/updatePassword.dto";
import { User, UserData } from "../entities/User";
import type { IUsersRepository } from "../repositories/IUsersRepository";

type Request = UpdatePasswordDto;

type Response = UserData;

@injectable()
export class UpdatePasswordUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("Hash") private readonly hashService: IHash
  ) {}

  async execute({
    currentPassword,
    id,
    newPassword,
  }: UpdatePasswordDto): Promise<Response> {
    User.validatePassword(newPassword);

    const user = await this.usersRepository.findOneWithPassword({ id });

    if (!user) throw new NotFoundError("user not found");

    const validateCurrentPassword = await this.hashService.compare(
      currentPassword,
      user.password
    );

    if (!validateCurrentPassword)
      throw new BadRequestError("current password is incorrect");

    const newPasswordHash = await this.hashService.hash(newPassword);

    const updatedUser = await this.usersRepository.updatePassword({
      id,
      newPassword: newPasswordHash,
    });

    return updatedUser;
  }
}
