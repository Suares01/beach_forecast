import config from "config";
import { inject, injectable } from "tsyringe";

import { IClientsConfig } from "@config/types/configTypes";
import { NotFoundError } from "@core/errors/NotFoundError";
import { UseCase } from "@core/UseCase";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IEmailService } from "@services/emailService/IEmailService";

import { IOtp, Otp } from "../models/Otp";
import { IOtpRepository } from "../repositories/IOtpRepository";

type Request = { email: string };

type Response = void;

const clientsConfig = config.get<IClientsConfig>("App.clients");

@injectable()
export class ForgotPasswordUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository,
    @inject("OtpRepository")
    private readonly otpRepository: IOtpRepository,
    @inject("EmailService")
    private readonly emailService: IEmailService
  ) {}

  public async execute({ email }: Request): Promise<Response> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) throw new NotFoundError("user not found");

    let otp: IOtp | null = null;

    otp = await this.otpRepository.findOne({
      userId: user.id,
    });

    const entity = new Otp(user.id);

    if (!otp) {
      otp = await this.otpRepository.create({
        id: entity.id,
        expiresIn: entity.expiresIn,
        isAlreadyUsed: entity.isAlreadyUsed,
        otp: entity.otp,
        userId: entity.userId,
      });
    } else {
      otp = await this.otpRepository.updateToken(entity.userId, {
        otp: entity.otp,
        expiresIn: entity.expiresIn,
      });
    }

    await this.emailService.send(email, "Forgot password", "forgot_password", {
      otp: otp.otp,
      username: user.username,
      url: clientsConfig.web,
      email: user.email,
    });
  }
}
