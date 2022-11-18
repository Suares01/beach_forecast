import { isAfter } from "date-fns";
import { inject, injectable } from "tsyringe";

import { BadRequestError } from "@core/errors/BadRequestError";
import { NotFoundError } from "@core/errors/NotFoundError";
import { UseCase } from "@core/UseCase";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IHash } from "@services/hash/IHash";

import { IOtpRepository } from "../repositories/IOtpRepository";

type Request = {
  email: string;
  newPassword: string;
  otp: number;
};

type Response = void;

@injectable()
export class ResetPasswordUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("OtpRepository")
    private readonly otpRepository: IOtpRepository,
    @inject("Hash")
    private readonly hashService: IHash
  ) {}

  public async execute({ email, newPassword, otp }: Request): Promise<void> {
    User.validatePassword(newPassword);

    const user = await this.usersRepository.findOne({
      email,
    });

    if (!user) throw new NotFoundError("user not found");

    const userOtp = await this.otpRepository.findOne({
      userId: user.id,
    });

    if (!userOtp) throw new NotFoundError("one time password does not exists");

    if (userOtp.isAlreadyUsed)
      throw new BadRequestError("one time password has already used");

    if (otp !== userOtp.otp)
      throw new BadRequestError("invalid one time password");

    const now = new Date();

    const isExpired = isAfter(now, userOtp.expiresIn);

    if (isExpired) throw new BadRequestError("one time password is expired");

    const newPasswordHash = await this.hashService.hash(newPassword);

    await this.usersRepository.updatePassword({
      id: user.id,
      newPassword: newPasswordHash,
    });

    await this.otpRepository.setAsUsed(user.id);
  }
}
