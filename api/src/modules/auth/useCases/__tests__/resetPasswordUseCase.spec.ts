import "reflect-metadata";

import { describe, expect, it, vi } from "vitest";

import { Otp } from "@modules/auth/models/Otp";
import { IOtpRepository } from "@modules/auth/repositories/IOtpRepository";
import { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IHash } from "@services/hash/IHash";

import { ResetPasswordUseCase } from "../ResetPasswordUseCase";

describe("ResetPasswordUseCase", () => {
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
    updatePassword: vi
      .fn()
      .mockResolvedValue({ ...defaultUser, password: undefined }),
  };
  const mockedRecoveryPasswordTokenRepository: Partial<IOtpRepository> = {
    findOne: vi.fn().mockResolvedValue(otpData),
    setAsUsed: vi.fn().mockResolvedValue({ ...otpData, isAlreadyUsed: true }),
  };
  const mockedHashService: Partial<IHash> = {
    hash: vi.fn().mockResolvedValue("newPasswordHash"),
  };

  const resetPasswordUseCase = new ResetPasswordUseCase(
    mockedUsersRepository as IUsersRepository,
    mockedRecoveryPasswordTokenRepository as IOtpRepository,
    mockedHashService as IHash
  );

  it("should update user password and set the OTP as already used", async () => {
    await resetPasswordUseCase.execute({
      email: defaultUser.email,
      newPassword: "123456",
      otp: otpData.otp,
    });

    expect(mockedHashService.hash).toHaveBeenCalledWith("123456");
    expect(mockedUsersRepository.updatePassword).toHaveBeenCalledWith({
      id: defaultUser.id,
      newPassword: "newPasswordHash",
    });
    expect(
      mockedRecoveryPasswordTokenRepository.setAsUsed
    ).toHaveBeenCalledWith(defaultUser.id);
  });

  it("should throw an error if the user does not exists", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(null);

    await expect(
      resetPasswordUseCase.execute({
        email: defaultUser.email,
        newPassword: "123456",
        otp: otpData.otp,
      })
    ).rejects.toThrow();
    expect(mockedUsersRepository.findOne).toHaveBeenCalled();
  });

  it("should throw an error if the user does not have a OTP", async () => {
    vi.spyOn(
      mockedRecoveryPasswordTokenRepository,
      "findOne"
    ).mockResolvedValueOnce(null);

    await expect(
      resetPasswordUseCase.execute({
        email: defaultUser.email,
        newPassword: "123456",
        otp: otpData.otp,
      })
    ).rejects.toThrow();
    expect(mockedRecoveryPasswordTokenRepository.findOne).toHaveBeenCalled();
  });

  it("should throw an error if the OTP has already been used", async () => {
    vi.spyOn(
      mockedRecoveryPasswordTokenRepository,
      "findOne"
    ).mockResolvedValueOnce({ ...otpData, isAlreadyUsed: true });

    await expect(
      resetPasswordUseCase.execute({
        email: defaultUser.email,
        newPassword: "123456",
        otp: otpData.otp,
      })
    ).rejects.toThrow();
    expect(mockedRecoveryPasswordTokenRepository.findOne).toHaveBeenCalled();
  });

  it("should throw an error if the provided OTP is invalid", async () => {
    await expect(
      resetPasswordUseCase.execute({
        email: defaultUser.email,
        newPassword: "123456",
        otp: 12345,
      })
    ).rejects.toThrow();
    expect(mockedRecoveryPasswordTokenRepository.findOne).toHaveBeenCalled();
  });

  it("should throw an error if the OTP is expired", async () => {
    const expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() - 2);
    vi.spyOn(
      mockedRecoveryPasswordTokenRepository,
      "findOne"
    ).mockResolvedValueOnce({
      ...otpData,
      expiresIn: expiredDate,
    });

    await expect(
      resetPasswordUseCase.execute({
        email: defaultUser.email,
        newPassword: "123456",
        otp: otpData.otp,
      })
    ).rejects.toThrow();
    expect(mockedRecoveryPasswordTokenRepository.findOne).toHaveBeenCalled();
  });
});
