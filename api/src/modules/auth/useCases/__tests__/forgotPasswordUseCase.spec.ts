import "reflect-metadata";

import { describe, expect, it, vi } from "vitest";

import { Otp } from "@modules/auth/models/Otp";
import { IOtpRepository } from "@modules/auth/repositories/IOtpRepository";
import { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IEmailService } from "@services/emailService/IEmailService";

import { ForgotPasswordUseCase } from "../ForgotPasswordUseCase";

describe("ForgotPasswordUseCase", () => {
  const createUserDto: CreateUserDto = {
    username: "john_doe",
    email: "doe@mail.com",
    password: "123456Doe",
  };
  const { id, createdAt, email, password, updatedAt, username, verified } =
    new User(createUserDto);
  const defaultUser = {
    id,
    createdAt,
    email,
    password,
    updatedAt,
    username,
    verified,
  };
  const {
    id: otpId,
    expiresIn,
    isAlreadyUsed,
    otp,
    userId,
  } = new Otp(defaultUser.id);
  const otpData = {
    id: otpId,
    expiresIn,
    isAlreadyUsed,
    otp,
    userId,
  };

  const mockedUsersRepository: Partial<IUsersRepository> = {
    findOne: vi.fn().mockResolvedValue({ ...defaultUser, password: undefined }),
  };
  const mockedRecoveryPasswordTokenRepository: Partial<IOtpRepository> = {
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(otpData),
    updateToken: vi.fn().mockResolvedValue(otpData),
  };
  const emailService: Partial<IEmailService> = {
    send: vi.fn().mockResolvedValue(undefined),
  };

  const forgotPasswordUseCase = new ForgotPasswordUseCase(
    mockedUsersRepository as IUsersRepository,
    mockedRecoveryPasswordTokenRepository as IOtpRepository,
    emailService as IEmailService
  );

  it("should create a new OTP if the user does not have", async () => {
    await forgotPasswordUseCase.execute({ email: defaultUser.email });

    expect(mockedUsersRepository.findOne).toHaveBeenCalled();
    expect(mockedRecoveryPasswordTokenRepository.findOne).toHaveBeenCalled();
    expect(mockedRecoveryPasswordTokenRepository.create).toHaveBeenCalled();
    expect(
      mockedRecoveryPasswordTokenRepository.updateToken
    ).not.toHaveBeenCalled();
    expect(emailService.send).toHaveBeenCalled();
  });

  it("should update a OTP if the user already have", async () => {
    vi.spyOn(
      mockedRecoveryPasswordTokenRepository,
      "findOne"
    ).mockResolvedValueOnce(otpData);

    await forgotPasswordUseCase.execute({ email: defaultUser.email });

    expect(mockedUsersRepository.findOne).toHaveBeenCalled();
    expect(mockedRecoveryPasswordTokenRepository.findOne).toHaveBeenCalled();
    expect(mockedRecoveryPasswordTokenRepository.create).not.toHaveBeenCalled();
    expect(
      mockedRecoveryPasswordTokenRepository.updateToken
    ).toHaveBeenCalled();
    expect(emailService.send).toHaveBeenCalled();
  });

  it("should throw an error if the user does not exists", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(null);

    const recovery = forgotPasswordUseCase.execute({
      email: defaultUser.email,
    });

    await expect(recovery).rejects.toThrow();
    expect(
      mockedRecoveryPasswordTokenRepository.findOne
    ).not.toHaveBeenCalled();
  });
});
